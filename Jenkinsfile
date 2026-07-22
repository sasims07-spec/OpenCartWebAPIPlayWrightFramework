pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
        maven 'Maven-3.9'
        jdk 'JDK-17'
        allure 'Allure'
    }

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['QA', 'dev', 'stage', 'Prod'], description: 'Select environment')
        choice(name: 'TEST_SUITE', choices: ['all', 'smoke', 'regression', 'api-smoke'], description: 'Select test suite')
    }

    environment {
        SLACK_CHANNEL = '#general'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {

        // 🔹 Stage 1: Build App + Unit Tests
        stage('Build & Unit Tests') {
            steps {
                dir('dev-app') {
                    git url: 'https://github.com/jglick/simple-maven-project-with-tests.git', branch: 'master'
                    bat 'mvn clean install -Dmaven.test.failure.ignore=true'
                }
            }
            post {
                always {
                    junit 'dev-app\\target\\surefire-reports\\*.xml'
                }
            }
        }

        // 🔹 Stage 2: Install Playwright Framework
        stage('Install Framework') {
            steps {
                dir('qa-tests') {
                    git url: 'https://github.com/sasims07-spec/OpenCartWebAPIPlayWrightFramework.git', branch: 'main'
                    bat 'npm ci'
                    bat 'npx playwright install chromium'
                }
            }
        }

        // 🔹 DEV
        stage('DEV - Sanity Tests') {
            steps {
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'dev-credentials', usernameVariable: 'OC_USERNAME', passwordVariable: 'OC_PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'dev-base-url', variable: 'BASE_URL'),
                        string(credentialsId: 'api-base-url', variable: 'API_BASE_URL')
                    ]) {
                        bat """
                        set ENV=dev
                        set BASE_URL=%BASE_URL%
                        set OC_USERNAME=%OC_USERNAME%
                        set OC_PASSWORD=%OC_PASSWORD%
                        set API_BASE_URL=%API_BASE_URL%
                        set API_TOKEN=%API_TOKEN%

                        npx playwright test --project=chromium --grep @smoke
                        """
                    }
                }
            }
        }

        // 🔹 QA
        stage('QA - Regression Tests') {
            steps {
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'qa-credentials', usernameVariable: 'OC_USERNAME', passwordVariable: 'OC_PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'qa-base-url', variable: 'BASE_URL'),
                        string(credentialsId: 'api-base-url', variable: 'API_BASE_URL')
                    ]) {
                        bat """
                        set ENV=qa
                        set BASE_URL=%BASE_URL%
                        set OC_USERNAME=%OC_USERNAME%
                        set OC_PASSWORD=%OC_PASSWORD%
                        set API_BASE_URL=%API_BASE_URL%
                        set API_TOKEN=%API_TOKEN%

                        npx playwright test --project=chromium
                        """
                    }
                }
            }
        }

        // 🔹 STAGE
        stage('STAGE - Sanity Tests') {
            steps {
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'stage-credentials', usernameVariable: 'OC_USERNAME', passwordVariable: 'OC_PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'stage-base-url', variable: 'BASE_URL'),
                        string(credentialsId: 'api-base-url', variable: 'API_BASE_URL')
                    ]) {
                        bat """
                        set ENV=stage
                        set BASE_URL=%BASE_URL%
                        set OC_USERNAME=%OC_USERNAME%
                        set OC_PASSWORD=%OC_PASSWORD%
                        set API_BASE_URL=%API_BASE_URL%
                        set API_TOKEN=%API_TOKEN%

                        npx playwright test --project=chromium --grep @smoke
                        """
                    }
                }
            }
        }

        // 🔹 PROD Approval
        stage('Approval for PROD') {
            steps {
                input message: 'Deploy to PROD?', ok: 'Yes Deploy'
            }
        }

        // 🔹 PROD
        stage('PROD - Smoke Tests') {
            steps {
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'prod-credentials', usernameVariable: 'OC_USERNAME', passwordVariable: 'OC_PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'prod-base-url', variable: 'BASE_URL'),
                        string(credentialsId: 'api-base-url', variable: 'API_BASE_URL')
                    ]) {
                        bat """
                        set ENV=prod
                        set BASE_URL=%BASE_URL%
                        set OC_USERNAME=%OC_USERNAME%
                        set OC_PASSWORD=%OC_PASSWORD%
                        set API_BASE_URL=%API_BASE_URL%
                        set API_TOKEN=%API_TOKEN%

                        npx playwright test --project=chromium --grep @smoke
                        """
                    }
                }
            }
        }
    }

    // 🔹 Notifications
    post {
        always {
            script {
                def status = currentBuild.currentResult
                def emoji = status == 'SUCCESS' ? '✅' : '❌'

                slackSend(
                    channel: env.SLACK_CHANNEL,
                    message: "Pipeline ${emoji} ${status} | Build #${env.BUILD_NUMBER}"
                )

                emailext(
                    to: 'your@email.com',
                    subject: "Build ${status}",
                    body: "Build #${env.BUILD_NUMBER} finished with status ${status}"
                )
            }
        }
    }
}