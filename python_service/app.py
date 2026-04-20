from fastapi import FastAPI, UploadFile, File, HTTPException
import numpy as np
import cv2
from deepface import DeepFace

app = FastAPI()

def cosine_distance(a, b):
    return 1 - np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@app.post("/embed")
async def embed(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img_np = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

    emb = DeepFace.represent(
        frame,
        model_name="Facenet",
        enforce_detection=False
    )[0]["embedding"]

    return {"embedding": emb}

@app.post("/compare")
async def compare(data: dict):
    stored = np.array(data["stored"], dtype=np.float32)
    live = np.array(data["live"], dtype=np.float32)

    dist = cosine_distance(stored, live)

    return {
        "match": bool(dist < 0.35),
        "distance": float(dist)
    }
