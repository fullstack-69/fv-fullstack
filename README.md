# Form and Validation

- Deployment

## Building

- `docker compose --env-file ./.env up -d --force-recreate --build`

## Testing

- `docker network create fv-net`

## Push to dockerhub

- `docker tag fv-frontend nnnpooh/fv-frontend:latest`
- `docker push nnnpooh/fv-frontend:latest`
- `docker tag fv-backend nnnpooh/fv-backend:latest`
- `docker push nnnpooh/fv-backend:latest`
