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
                sh 'docker build -f frontend/dockerfile -t "tarlesiddhesh/notes-frontend:latest"'
                sh 'docker build -f backend/dockerfile -t "tarlesiddhesh/notes-backend:latest"'
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
