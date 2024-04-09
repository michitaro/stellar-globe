## Development

See `Dockerfile` for the build environment.

## Build by Docker

```bash
mkdir -p products
docker build -t stellar-globe .
docker run -i --rm  stellar-globe tar -cf- -C /products . | tar -xvf- -C products
```
