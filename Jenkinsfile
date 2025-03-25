pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials' 
        DOCKER_HUB_USERNAME = 'heena2325'
        IMAGE_FRONTEND = 'heena2325/todo-frontend'
        IMAGE_BACKEND = 'heena2325/todo-backend'
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
                        dir('Application-Code/frontend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Install Backend Dependencies') {
                    steps {
                        dir('Application-Code/backend') {
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
                        dir('Application-Code/frontend') {
                            sh 'npx jest --passWithNoTests --watchAll=false'
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('Application-Code/backend') {
                            sh 'npx jest --passWithNoTests'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('Application-Code') {
                    sh 'docker-compose up --build -d'
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
                dir('Application-Code') {
                    sh 'docker-compose push'
                }
            }
        }

        stage('Clean Up') {
            steps {
                sh 'docker rmi $IMAGE_FRONTEND $IMAGE_BACKEND || true'
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
