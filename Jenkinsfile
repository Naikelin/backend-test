pipeline {
    agent any
    environment {
        REGISTRY = "localhost:8082"     
        REGISTRY_CREDENTIALS = "registry"
        SONARQUBE_CREDENTIALS = "sonarqube"
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
                        sh 'npm run test --verbose'
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

        stage("Quality assurance"){
            agent {
                docker {
                    label 'contenedores'
                    image 'sonarsource/sonar-scanner-cli'
                    args '--network=devops-infra_default'
                    reuseNode true
                }
            }
            stages{
                stage("Quality assurance - sonarqube"){
                    steps{
                        withSonarQubeEnv('sonarqube') {
                            sh 'sonar-scanner'
                        }
                    }
                }
                stage("Quality assurance - quality gate"){
                    steps{
                        script{
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

        stage("Delivery - Build Docker Image") {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage("Delivery - Tag Docker Image") {
            steps {
                echo "Tagging image with 'latest' and 'build number' tags..."
                sh "docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest"
                sh "docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage("Delivery - Push Docker Image") {
            steps {
                script {
                    docker.withRegistry("http://${REGISTRY}", "${REGISTRY_CREDENTIALS}") {
                        echo "Pushing image with 'latest' tag to Nexus..."
                        sh "docker push ${REGISTRY}/${IMAGE_NAME}:latest"

                        echo "Pushing image with 'build number' tag to Nexus..."
                        sh "docker push ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
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
