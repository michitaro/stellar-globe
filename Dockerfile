# common builder
FROM node:20-bookworm as builder
RUN apt-get update && \
    apt-get install -y \
    python3-full \
    rsync \
    make \
    && rm -rf /var/lib/apt/lists/*

# stellar-globe
FROM builder as stellar-globe
COPY ./stellar-globe /src/stellar-globe
RUN make -C /src/stellar-globe


# react-stellar-globe
FROM builder as react-stellar-globe
COPY ./react-stellar-globe /src/react-stellar-globe
COPY --from=stellar-globe /src/stellar-globe /src/stellar-globe
RUN make -C /src/react-stellar-globe


# react-draggable-dialog
FROM builder as react-draggable-dialog
COPY ./react-draggable-dialog /src/react-draggable-dialog
RUN make -C /src/react-draggable-dialog


# app
FROM builder as app
COPY --from=stellar-globe /src/stellar-globe /src/stellar-globe
COPY --from=react-stellar-globe /src/react-stellar-globe /src/react-stellar-globe
COPY --from=react-draggable-dialog /src/react-draggable-dialog /src/react-draggable-dialog
COPY ./app /src/app
RUN make -C /src/app node_modules
RUN make -C /src/app -j


# python-integration/python
FROM builder as python
COPY --from=app /src/app /src/app
COPY ./python-integration/python /src/python-integration/python
RUN make -C /src/python-integration/python setup datamodel build base_python=python3


# python-integration/jupyterlab-extension
FROM builder as jupyterlab-extension
COPY .git /src/.git
COPY --from=stellar-globe /src/stellar-globe /src/stellar-globe
COPY --from=react-stellar-globe /src/react-stellar-globe /src/react-stellar-globe
COPY --from=app /src/app /src/app
COPY ./python-integration/jupyterlab-extension /src/python-integration/jupyterlab-extension
RUN make -C /src/python-integration/jupyterlab-extension setup build base_python=python3


# python-integration/jupyterlite
FROM builder as jupyterlite
COPY --from=python /src/python-integration/python /src/python-integration/python
COPY --from=jupyterlab-extension /src/python-integration/jupyterlab-extension /src/python-integration/jupyterlab-extension
COPY ./python-integration/jupyterlite /src/python-integration/jupyterlite
RUN make -C /src/python-integration/jupyterlite setup build base_python=python3


# final
FROM builder

RUN mkdir -p /products

COPY --from=app /src/app/dist /products/app
COPY --from=python /src/python-integration/python/dist /products/python
COPY --from=jupyterlab-extension /src/python-integration/jupyterlab-extension/dist /products/jupyterlab-extension
COPY --from=jupyterlite /src/python-integration/jupyterlite/_output /products/jupyterlite