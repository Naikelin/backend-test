pipeline {
    agent any
    environment {
        REGISTRY = "http://localhost:8082"          
        IMAGE_NAME = "backend-test"
        SONAR_PROJECT_KEY = "sonar-project-key"
        SONAR_HOST_URL = "http://sonarqube:9000"
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
                        sh 'npm install'
                    }
                }
                stage("Run tests") {
                    steps {
                        echo "Running tests..."
                        sh 'npm run test'
                    }
                }
                stage("Build project") {
                    steps {
                        echo "Building project..."
                        sh 'npm run build'
                    }
                }
            }
        }

        stage("Quality assurance") {
            agent {
                docker {
                    label 'containers'
                    image 'sonarsource/sonar-scanner-cli'
                    args '--network=devops-infra_default'
                    reuseNode true
                }
            }
            stages {
                stage("SonarQube analysis") {
                    steps {
                        withSonarQubeEnv('sonarqube') {
                            sh 'sonar-scanner'
                        }
                    }
                }
                stage("Quality gate check") {
                    steps {
                        script {
                            timeout(time: 1, unit: 'MINUTES') {
                                def qg = waitForQualityGate()
                                if (qg.status != 'OK') {
                                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                                }
                            }
                        }
                    }
                }
            }
        }

        stage("Delivery - Upload to Nexus") {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${IMAGE_NAME} ."

                    echo "Pushing image with 'latest' tag to Nexus..."
                    sh "docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest"
                    sh "docker push ${REGISTRY}/${IMAGE_NAME}:latest"

                    echo "Pushing image with 'build number' tag to Nexus..."
                    sh "docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "docker push ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
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
