# app/db/connection.py
import mysql.connector
from mysql.connector import Error
from contextlib import contextmanager
from config import DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_CHARSET

@contextmanager
def get_db_connection():
    """
    Context manager para conexão MySQL
    Uso: with get_db_connection() as conn:
    """
    conn = None
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_DATABASE,
            user=DB_USERNAME,
            password=DB_PASSWORD,
            charset=DB_CHARSET,
            autocommit=False  # Controle manual de transações
        )
        
        if conn.is_connected():
            yield conn
        else:
            raise Error("Não foi possível conectar ao banco")
            
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
        if conn:
            conn.rollback()
        raise
        
    finally:
        if conn and conn.is_connected():
            conn.close()


def init_db():
    """
    Inicializa o banco de dados executando schema.sql
    """
    import os
    
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema = f.read()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Executa cada statement SQL separadamente
        for statement in schema.split(';'):
            if statement.strip():
                cursor.execute(statement)
        
        conn.commit()
        cursor.close()
        
    print("✅ Banco de dados inicializado com sucesso!")