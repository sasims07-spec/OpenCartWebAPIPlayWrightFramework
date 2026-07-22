// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Master CI/CD Pipeline (Windows / Native)
// Playwright TypeScript Framework
// Runs tests directly on the Windows Jenkins agent (no Docker)
// ═══════════════════════════════════════════════════════════════

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

        // ═════════════════════════════════════════════════
        // STAGE 1: BUILD APP + UNIT TESTS
        // ═════════════════════════════════════════════════
        stage('Build & Unit Tests') {
            steps {
                echo "========================================="
                echo "  Building App + Running Unit Tests"
                echo "========================================="
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

        // ═════════════════════════════════════════════════
        // STAGE 2: INSTALL PLAYWRIGHT FRAMEWORK
        // ═════════════════════════════════════════════════
        stage('Install Framework') {
            steps {
                dir('qa-tests') {
                    git url: 'https://github.com/sasims07-spec/OpenCartWebAPIPlayWrightFramework.git', branch: 'main'
                    bat 'npm ci'
                    bat 'npx playwright install chromium'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 3: DEV - SANITY
        // ═════════════════════════════════════════════════
        stage('DEV - Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @smoke on DEV"
                echo "========================================="
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'dev-credentials', usernameVariable: 'OC_USERNAME', passwordVariable: 'OC_PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                        string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
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
                        set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                        set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                        set GRANT_TYPE=client_credentials

                        npx playwright test --project=chromium --grep @smoke
                        """
                    }
                }
            }
            post {
                always {
                    dir('qa-tests') {
                        bat 'if not exist reports-dev\\allure mkdir reports-dev\\allure'
                        bat 'npx allure generate allure-results --clean -o reports-dev\\allure || exit /b 0'
                        publishHTML(target: [
                            reportName: 'DEV Sanity - PW HTML Report',
                            reportDir: 'reports/my-html-report',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                        publishHTML(target: [
                            reportName: 'DEV Sanity - Allure Report',
                            reportDir: 'reports-dev/allure',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                    }
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 4: QA - REGRESSION
        // ═════════════════════════════════════════════════
        stage('QA - Regression Tests') {
            steps {
                echo "========================================="
                echo "  Running REGRESSION on QA"
                echo "========================================="
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'qa-credentials', usernameVariable: 'OC_USERNAME', passwordVariable: 'OC_PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                        string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
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
                        set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                        set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                        set GRANT_TYPE=client_credentials

                        npx playwright test --project=chromium
                        """
                    }
                }
            }
            post {
                always {
                    dir('qa-tests') {
                        bat 'if not exist reports-qa\\allure mkdir reports-qa\\allure'
                        bat 'npx allure generate allure-results --clean -o reports-qa\\allure || exit /b 0'
                        publishHTML(target: [
                            reportName: 'QA Regression - PW HTML Report',
                            reportDir: 'reports/my-html-report',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                        publishHTML(target: [
                            reportName: 'QA Regression - Allure Report',
                            reportDir: 'reports-qa/allure',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                    }
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 5: STAGE - SANITY
        // ═════════════════════════════════════════════════
        stage('STAGE - Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @smoke on STAGE"
                echo "========================================="
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'stage-credentials', usernameVariable: 'OC_USERNAME', passwordVariable: 'OC_PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                        string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
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
                        set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                        set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                        set GRANT_TYPE=client_credentials

                        npx playwright test --project=chromium --grep @smoke
                        """
                    }
                }
            }
            post {
                always {
                    dir('qa-tests') {
                        bat 'if not exist reports-stage\\allure mkdir reports-stage\\allure'
                        bat 'npx allure generate allure-results --clean -o reports-stage\\allure || exit /b 0'
                        publishHTML(target: [
                            reportName: 'STAGE Sanity - PW HTML Report',
                            reportDir: 'reports/my-html-report',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                        publishHTML(target: [
                            reportName: 'STAGE Sanity - Allure Report',
                            reportDir: 'reports-stage/allure',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                    }
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 6: PROD APPROVAL + SMOKE
        // ═════════════════════════════════════════════════
        stage('Approval for PROD') {
            steps {
                input message: 'Deploy to PROD?', ok: 'Yes, Deploy!'
            }
        }

        stage('PROD - Smoke Tests') {
            steps {
                echo "========================================="
                echo "  Running SMOKE @smoke on PROD"
                echo "========================================="
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'prod-credentials', usernameVariable: 'OC_USERNAME', passwordVariable: 'OC_PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                        string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
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
                        set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                        set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                        set GRANT_TYPE=client_credentials

                        npx playwright test --project=chromium --grep @smoke
                        """
                    }
                }
            }
            post {
                always {
                    dir('qa-tests') {
                        bat 'if not exist reports-prod\\allure mkdir reports-prod\\allure'
                        bat 'npx allure generate allure-results --clean -o reports-prod\\allure || exit /b 0'
                        publishHTML(target: [
                            reportName: 'PROD Smoke - PW HTML Report',
                            reportDir: 'reports/my-html-report',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                        publishHTML(target: [
                            reportName: 'PROD Smoke - Allure Report',
                            reportDir: 'reports-prod/allure',
                            reportFiles: 'index.html',
                            keepAll: true,
                            alwaysLinkToLastBuild: true
                        ])
                    }
                }
            }
        }
    }

    // ═════════════════════════════════════════════════════
    // POST — SLACK + EMAIL NOTIFICATIONS
    // ═════════════════════════════════════════════════════
    post {
        always {
            script {
                def buildStatus = currentBuild.currentResult
                def statusEmoji = buildStatus == 'SUCCESS' ? '✅' : '❌'
                def statusColor = buildStatus == 'SUCCESS' ? 'good' : 'danger'

                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: statusColor,
                    message: """
🎭 *Playwright CI/CD Pipeline Report*

*Overall: ${statusEmoji} ${buildStatus}*
*Environment:* `${params.ENVIRONMENT}`
*Build:* #${env.BUILD_NUMBER}
*Duration:* ${currentBuild.durationString.replace(' and counting', '')}

📊 <${env.BUILD_URL}|View Reports in Jenkins>
🔍 <${env.BUILD_URL}console|View Console Logs>
                    """
                )

                emailext(
                    to: 'sasims07@gmail.com,sasimanidoc@gmail.com',
                    subject: "🎭 CI/CD — ${statusEmoji} ${buildStatus} — Build #${env.BUILD_NUMBER}",
                    mimeType: 'text/html',
                    body: """
                        <html>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
                            <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center;">
                                    <h1 style="margin: 0; font-size: 24px;">🎭 Playwright CI/CD Dashboard</h1>
                                    <p style="margin: 8px 0 0; opacity: 0.8;">Jenkins Pipeline Report</p>
                                    <span style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-top: 12px; background: ${buildStatus == 'SUCCESS' ? '#28a745' : '#dc3545'}; color: white;">
                                        ${statusEmoji} ${buildStatus}
                                    </span>
                                </div>
                                <div style="padding: 24px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr><td style="padding: 10px; color: #666;">Environment</td><td style="padding: 10px; font-weight: bold;">${params.ENVIRONMENT}</td></tr>
                                        <tr><td style="padding: 10px; color: #666;">Build</td><td style="padding: 10px; font-weight: bold;">#${env.BUILD_NUMBER}</td></tr>
                                        <tr><td style="padding: 10px; color: #666;">Duration</td><td style="padding: 10px; font-weight: bold;">${currentBuild.durationString.replace(' and counting', '')}</td></tr>
                                    </table>
                                </div>
                                <div style="background: #f8f9fa; padding: 20px 24px; border-top: 1px solid #eee;">
                                    <h3 style="margin: 0 0 12px;">📊 Reports</h3>
                                    <a href="${env.BUILD_URL}" style="display: inline-block; padding: 10px 20px; background: #1a1a2e; color: white; text-decoration: none; border-radius: 6px; margin: 4px;">📁 Open Jenkins Build</a>
                                    <a href="${env.BUILD_URL}console" style="display: inline-block; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 6px; margin: 4px;">🔍 Console Logs</a>
                                </div>
                                <div style="text-align: center; padding: 16px; color: #999; font-size: 12px;">
                                    OpenCart Playwright Framework | Build #${env.BUILD_NUMBER}
                                </div>
                            </div>
                        </body>
                        </html>
                    """
                )
            }
        }
        success {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ✅ SUCCESS'
            echo '═══════════════════════════════════════════'
        }
        failure {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ❌ FAILED'
            echo '═══════════════════════════════════════════'
        }
    }
}
