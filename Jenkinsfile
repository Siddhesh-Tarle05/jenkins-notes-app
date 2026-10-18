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
                sh 'docker build -f frontend/Dockerfile -t tarlesiddhesh/notes-frontend:latest ./frontend'
                sh 'docker build -f backend/Dockerfile -t tarlesiddhesh/notes-backend:latest ./backend'
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
    }
}
