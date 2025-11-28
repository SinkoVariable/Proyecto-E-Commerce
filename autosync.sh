#!/bin/bash

while true; do
    git add .
    git commit -m "Auto-sync desde Codespaces 🚀" || true
    git push origin main || true
    sleep 20  # cada 20 segundos intenta sincronizar
done
