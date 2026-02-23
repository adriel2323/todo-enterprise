# Usa la versión exacta de Node que tendrás en producción
FROM node:20-bullseye

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Instala dependencias globales si las necesitas (ej. NestJS CLI o nodemon)
# RUN npm install -g @nestjs/cli

# Expone el puerto que usará tu aplicación (ej. 3000)
EXPOSE 3000

# El comando por defecto mantendrá el contenedor vivo para que puedas trabajar
CMD ["sleep", "infinity"]