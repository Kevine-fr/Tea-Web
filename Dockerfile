FROM node:20-alpine

WORKDIR /app

# Outils utiles
RUN apk add --no-cache bash git

# On expose le port Vite
EXPOSE 5173

# On laisse le conteneur vivant pour que VS Code s'y connecte
CMD ["sh", "-c", "while sleep 1000; do :; done"]