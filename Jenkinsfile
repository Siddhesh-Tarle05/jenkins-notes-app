pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Images'){
            steps{
                sh 'docker build -f frontend/dockerfile -t tarlesiddhesh/notes-frontend:latest ./frontend'
                sh 'docker build -f backend/dockerfile -t tarlesiddhesh/notes-backend:latest ./backend'
            }
        }
        stage('Push Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_TOKEN" |
                            docker login -u "$DOCKER_USER" --password-stdin

                        docker push tarlesiddhesh/notes-frontend:latest
                        docker push tarlesiddhesh/notes-backend:latest

                        docker logout
                    '''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl set image deployment/frontend-deployment frontend=tarlesiddhesh/notes-frontend:latest'
                sh 'kubectl set image deployment/backend-deployment backend=tarlesiddhesh/notes-backend:latest'

                sh 'kubectl rollout status deployment/frontend-deployment'
                sh 'kubectl rollout status deployment/backend-deployment'
            }
        }
    }
}
