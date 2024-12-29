from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import openai
import base64
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to specific origins, e.g., ["http://127.0.0.1:1234"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI API client
openai.api_key = os.getenv("OPENAI_API_KEY")


# @app.post("/process-image/")
# async def process_image(file: UploadFile = File(...)):
#     try:
#         # Read the image file
#         image_data = await file.read()
#         # Call OpenAI API
#         response = openai.ChatCompletion.create(
#             model="gpt-4o",
#             messages=[
#                 {
#                     "role": "user",
#                     "content": [
#                         {
#                             "type": "text",
#                             "text": "Please extract the colors from this image, and give me the names, RGB, and hex codes of them. Please return in JSON format.",
#                         },
#                         {
#                             "type": "image_url",
#                             "image_url": {
#                                 "url": img_str,
#                             },
#                         },
#                     ],
#                 },
#             ],
#             response_format="json",
#             temperature=1,
#             max_tokens=2048,
#             top_p=1,
#             frequency_penalty=0,
#             presence_penalty=0,
#         )


#         # Parse and return the response
#         result = response.choices[0].message["content"]
#         return JSONResponse(content=result)
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)
@app.post("/process-image/")
async def process_image(file: UploadFile = File(...)):
    try:
        # Read the image file
        image_data = await file.read()

        # Convert to base64
        import base64

        base64_image = base64.b64encode(image_data).decode("utf-8")

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Please extract the colors from this image, and give me the names, RGB, and hex codes of them. Please return in JSON format.",
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                },
            ],
            response_format={"type": "json_object"},
            max_tokens=2048,
            temperature=0,
        )

        # Parse and return the response
        result = response.choices[0].message.content
        return JSONResponse(content=result)

    except Exception as e:
        import logging

        logging.error(f"Error processing image: {str(e)}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
