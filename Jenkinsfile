pipeline {
    agent any
    environment {
        REGISTRY_HOST = "localhost:8082"     
        REGISTRY_CREDENTIALS = "registry"     
        IMAGE_NAME = "backend-test"
    }

    stages {
        stage("Build") {
            agent {
                docker {
                    label 'containers'
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            stages {
                stage("Install dependencies") {
                    steps {
                        echo "Installing dependencies..."
                        sh 'npm install ---verbose'
                    }
                }
                stage("Run tests") {
                    steps {
                        echo "Running tests..."
                        sh 'npm run test --passWithNoTests --verbose'
                    }
                }
                stage("Build project") {
                    steps {
                        echo "Building project..."
                        sh 'npm run build --verbose'
                    }
                }
            }
        }

        stage("Delivery - Upload to Nexus") {
            steps {
                script {
                    docker.withRegistry("${REGISTRY_HOST}", "${REGISTRY_CREDENTIALS}") {
                      echo "Building Docker image..."
                      sh "docker build -t ${IMAGE_NAME} ."

                      echo "Pushing image with 'latest' tag to Nexus..."
                      sh "docker tag ${IMAGE_NAME}:latest ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
                      sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:latest"

                      echo "Pushing image with 'build number' tag to Nexus..."
                      sh "docker tag ${IMAGE_NAME}:latest ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER}"
                      sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'The pipeline failed.'
        }
    }
}
