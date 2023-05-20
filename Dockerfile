# Используйте официальный образ Node.js в качестве базового образа
FROM node:16-alpine

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование зависимостей в контейнер
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование остальных файлов проекта в контейнер
COPY . .

# Открытие порта, на котором будет работать приложение
ENV PORT=3000

# Команда запуска приложения в контейнере
CMD [ "npm", "start" ]