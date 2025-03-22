pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials' 
        DOCKER_HUB_USERNAME = 'heena2325'
        IMAGE_FRONTEND = 'heena2325/todo-frontend'
        IMAGE_BACKEND = 'heena2325/todo-backend'
        IMAGE_MONGO = 'heena2325/todo-mongo'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/Heena-dotcom/End-to-End-DevOps.git'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Install Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Install Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false'
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker build -t $IMAGE_FRONTEND ./frontend'
                    sh 'docker build -t $IMAGE_BACKEND ./backend'
                    sh 'docker build -t $IMAGE_MONGO ./mongodb'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh 'docker push $IMAGE_FRONTEND'
                    sh 'docker push $IMAGE_BACKEND'
                    sh 'docker push $IMAGE_MONGO'
                }
            }
        }

        stage('Clean Up') {
            steps {
                sh 'docker rmi $IMAGE_FRONTEND $IMAGE_BACKEND $IMAGE_MONGO || true'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed!'
        }
        success {
            echo 'Build and tests passed successfully!'
        }
        failure {
            echo 'Build or tests failed!'
        }
    }
}
