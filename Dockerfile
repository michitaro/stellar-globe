# common builder
FROM node:20-bookworm as builder
RUN apt-get update && \
    apt-get install -y \
    python3-full \
    rsync \
    make \
    && rm -rf /var/lib/apt/lists/*

