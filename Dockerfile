# Use the official Python image from the Docker Hub
FROM python:3.11-slim
ARG OPENAI_API_KEY
# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY backend/requirement.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirement.txt

# Copy the rest of the application code into the container
COPY backend .

# Expose the port that the app runs on
EXPOSE 8000
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]