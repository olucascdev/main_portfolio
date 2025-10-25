# Imagem base Python
FROM python:3.12-slim

# Diretório de trabalho
WORKDIR /app

# Variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código do projeto
COPY . .

# Expor porta 5000
EXPOSE 5000

# Comando padrão (será sobrescrito pelo docker-compose)
CMD ["python", "app.py"]