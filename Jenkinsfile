pipeline {

    agent any

    environment {
        IMAGE_NAME = "harshhh21/week9-cicd"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    echo "Running automated test..."

                    npm start > app.log 2>&1 &
                    APP_PID=$!

                    trap 'kill $APP_PID || true' EXIT

                    sleep 5

                    npm test
                '''
            }
        }

        stage('Package') {
            steps {
                sh '''
                    echo "Building Docker image..."

                    docker build \
                      -t ${IMAGE_NAME}:${IMAGE_TAG} \
                      -t ${IMAGE_NAME}:latest .

                    echo "Verifying Docker image..."

                    docker image inspect ${IMAGE_NAME}:${IMAGE_TAG} > /dev/null

                    echo "Docker image verified successfully."
                '''
            }
        }

        stage('Security Scan') {
            steps {
                sh '''
                    echo "Running Trivy security scan..."

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                          -u "$DOCKER_USERNAME" \
                          --password-stdin

                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {

        success {
            echo "CI/CD Pipeline completed successfully."
        }

        failure {
            echo "CI/CD Pipeline failed."
        }

        always {
            sh '''
                echo "Cleaning workspace..."

                rm -f app.log || true
            '''
        }
    }
}
