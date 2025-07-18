# from fastapi import FastAPI, Form, UploadFile, File
# from fastapi.responses import JSONResponse
# import face_recognition
# import numpy as np
# import requests
# import tempfile

# app = FastAPI()


 
# def download_image(url):
#     try:
#         response = requests.get(url, stream=True, timeout=10)
#         if response.status_code == 200:
#             temp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
#             temp.write(response.content)
#             temp.close()
#             return temp.name
#     except:
#         return None

# def extract_embedding(image_path):
#     image = face_recognition.load_image_file(image_path)
#     encodings = face_recognition.face_encodings(image)
#     if not encodings:
#         return None
#     return encodings[0]  


# @app.get("/")
# def read_root():
#     return {"message": "🎉 Face Recognition API is running!"}
# @app.post("/verify-face")
# async def verify_face(
#     cloud_image_url: str = Form(...),
#     stored_image_url: str = Form(...)
# ):
#     # Download both images
#     live_image_path = download_image(cloud_image_url)
#     stored_image_path = download_image(stored_image_url)

#     if not live_image_path or not stored_image_path:
#         return JSONResponse(status_code=400, content={"matched": False, "error": "Image download failed"})

#     # Get face embeddings
#     live_embedding = extract_embedding(live_image_path)
#     stored_embedding = extract_embedding(stored_image_path)

#     if live_embedding is None or stored_embedding is None:
#         return JSONResponse(status_code=400, content={"matched": False, "error": "Face not found in one of the images"})

#     # Compare faces
#     result = face_recognition.compare_faces([stored_embedding], live_embedding, tolerance=0.5)
#     distance = face_recognition.face_distance([stored_embedding], live_embedding)[0]

#     return {
#          "matched": bool(result[0]),  # ✅ Fix here
#         "distance": float(distance),
#         "confidence": round((1 - distance) * 100, 2)
#     }

# # @app.post("/verify-face")
# # async def verify_face(
# #     cloud_image_url: str = Form(...),
# #     stored_image_url: str = Form(...)
# # ):
# #     # Download both images
# #     live_image_path = download_image(cloud_image_url)
# #     stored_image_path = download_image(stored_image_url)

# #     if not live_image_path or not stored_image_path:
# #         return JSONResponse(status_code=400, content={"matched": False, "error": "Image download failed"})

# #     # Get face embeddings
# #     live_embedding = extract_embedding(live_image_path)
# #     stored_embedding = extract_embedding(stored_image_path)

# #     if not live_embedding or not stored_embedding:
# #         return JSONResponse(status_code=400, content={"matched": False, "error": "Face not found in one of the images"})

# #     # Compare faces
# #     result = face_recognition.compare_faces([stored_embedding], live_embedding, tolerance=0.5)
# #     distance = face_recognition.face_distance([stored_embedding], live_embedding)[0]


# #     return {
# #         "matched": result[0],
# #         "distance": float(distance),
# #         "confidence": round((1 - distance) * 100, 2)
# #     }

# from fastapi import FastAPI, Form
# from fastapi.responses import JSONResponse
# import numpy as np
# import requests
# import cv2
# from insightface.app import FaceAnalysis

# app = FastAPI()

# # Load InsightFace model once
# model = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
# model.prepare(ctx_id=0)

# # Convert image URL to OpenCV image (NumPy array)
# def url_to_np_image(url):
#     try:
#         response = requests.get(url, timeout=10)
#         img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
#         img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
#         return img
#     except:
#         return None

# # Extract embedding from image
# def get_embedding(image):
#     if image is None:
#         return None
#     faces = model.get(image)
#     if not faces:
#         return None
#     return faces[0].embedding

# @app.get("/")
# def read_root():
#     return {"message": "🎉 Face Recognition API is running!"}

# @app.post("/verify-face")
# async def verify_face(
#     cloud_image_url: str = Form(...),
#     stored_image_url: str = Form(...)
# ):
#     # Load images from URLs
#     img1 = url_to_np_image(cloud_image_url)
#     img2 = url_to_np_image(stored_image_url)

#     if img1 is None or img2 is None:
#         return JSONResponse(status_code=400, content={"matched": False, "error": "Image download failed"})

#     # Get embeddings
#     emb1 = get_embedding(img1)
#     emb2 = get_embedding(img2)

#     if emb1 is None or emb2 is None:
#         return JSONResponse(status_code=400, content={"matched": False, "error": "Face not found in one of the images"})

#     # Calculate cosine similarity
#     cosine_sim = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
#     matched = cosine_sim > 0.45  # threshold tuned for ~90% accuracy
#     confidence = round(cosine_sim * 100, 2)

#     return {
#     "matched": bool(matched),
#     "confidence": float(confidence),
#     "similarity_score": float(cosine_sim)
# }


from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
import numpy as np
import requests
import cv2
from insightface.app import FaceAnalysis

app = FastAPI()

model = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
model.prepare(ctx_id=0)

def url_to_np_image(url):
    try:
        response = requests.get(url, timeout=10)
        img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        return img
    except:
        return None

def get_embedding(image):
    if image is None:
        return None
    faces = model.get(image)
    if not faces:
        return None
    emb = faces[0].embedding
    return emb / np.linalg.norm(emb)  # Normalize for better comparison

@app.get("/")
def read_root():
    return {"message": "🎉 Face Recognition API is running!"}

@app.post("/verify-face")
async def verify_face(
    cloud_image_url: str = Form(...),
    stored_image_url: str = Form(...)
):
    img1 = url_to_np_image(cloud_image_url)
    img2 = url_to_np_image(stored_image_url)

    if img1 is None or img2 is None:
        return JSONResponse(status_code=400, content={"matched": False, "error": "Image download failed"})

    emb1 = get_embedding(img1)
    emb2 = get_embedding(img2)

    if emb1 is None or emb2 is None:
        return JSONResponse(status_code=400, content={"matched": False, "error": "Face not found in one of the images"})

    # Cosine similarity
    cosine_sim = np.dot(emb1, emb2)
    confidence = round(cosine_sim * 100, 2)
    matched = cosine_sim > 0.5

    return {
        "matched": bool(matched),
        "confidence":  float(confidence),
        "similarity_score": float(cosine_sim)
    }
