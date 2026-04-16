pipeline {
  agent none

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    DOCKER_IMAGE = 'zstin4/tea-web'
    NOTIFY_EMAIL = credentials('email')
  }
  
  stages { 

    // ══════════════════════════════════════════════════════════
    // 1. BUILD — Récupération du code
    // ══════════════════════════════════════════════════════════
    stage('Checkout') {
      agent {
        dockerfile {
          filename 'Dockerfile.ci'
          args '--network backend'
          additionalBuildArgs '--no-cache'
        }
      }
      steps { checkout scm }
    }

    // ══════════════════════════════════════════════════════════
    // 2. BUILD — Installation des dépendances Node
    // ══════════════════════════════════════════════════════════
    stage('Install Dependencies') {
      agent {
        dockerfile {
          filename 'Dockerfile.ci'
          args '--network backend'
        }
      }
      steps {
        sh 'npm ci --prefer-offline'
      }
    }

    // ══════════════════════════════════════════════════════════
    // 3. QUALITÉ — Analyse statique du code
    // ══════════════════════════════════════════════════════════
    stage('Lint') {
      agent {
        dockerfile {
          filename 'Dockerfile.ci'
          args '--network backend'
        }
      }
      steps {
        script {
          int rc = sh(script: 'npm run lint --if-present', returnStatus: true)
          if (rc == 0) {
            echo 'Lint : OK'
          } else {
            echo 'Lint : avertissements détectés (non bloquant)'
          }
        }
      }
    }

    // ══════════════════════════════════════════════════════════
    // 4. TESTS — Tests unitaires des modules API (Vitest)
    // ══════════════════════════════════════════════════════════
    stage('Unit Tests') {
      agent {
        dockerfile {
          filename 'Dockerfile.ci'
          args '--network backend'
        }
      }
      steps {
        script {
          int rc = sh(script: 'npm run test -- --run --reporter=verbose', returnStatus: true)
          if (rc == 0) {
            echo 'Tests unitaires : OK'
          } else {
            error("Echec des tests unitaires (exit code ${rc})")
          }
        }
      }
      post {
        always {
          sh 'npm run test:coverage -- --run 2>/dev/null || true'
        }
      }
    }

    // ══════════════════════════════════════════════════════════
    // 5. BUILD — Compilation Vite pour production
    // ══════════════════════════════════════════════════════════
    stage('Build Production') {
      agent {
        dockerfile {
          filename 'Dockerfile.ci'
          args '--network backend'
        }
      }
      steps {
        withEnv([
          "VITE_API_URL=${env.BRANCH_NAME == 'main' ? 'https://api-tea-main.' + env.APP_DOMAIN : 'https://api-tea-staging.' + env.APP_DOMAIN}",
          "VITE_SITE_URL=${env.BRANCH_NAME == 'main' ? env.APP_DOMAIN : 'staging.' + env.APP_DOMAIN}"
        ]) {
          sh '''
            npm run build
            echo "Build Vite termine - dist/ genere"
            du -sh dist/
          '''
        }
      }
    }

    // ══════════════════════════════════════════════════════════
    // 6. DOCKER — Build de l'image avec versionnage auto
    // ══════════════════════════════════════════════════════════
    stage('Build Docker Image') {
      agent any
      steps {
        script {
          def branch    = env.BRANCH_NAME
          def envPrefix = (branch == 'main') ? 'prod' : branch

          def newVersion = sh(returnStdout: true, script: """
            RESPONSE=\$(curl -sf 'https://hub.docker.com/v2/repositories/${env.DOCKER_IMAGE}/tags/?page_size=100' || echo '{}')
            LATEST=\$(echo "\$RESPONSE" \
              | grep -o '"name":"${envPrefix}-v[0-9]*\\.[0-9]*\\.[0-9]*"' \
              | grep -o '[0-9]*\\.[0-9]*\\.[0-9]*' \
              | sort -t. -k1,1n -k2,2n -k3,3n \
              | tail -1)
            if [ -z "\$LATEST" ]; then LATEST="1.0.0"; fi
            MAJ=\$(echo "\$LATEST" | cut -d. -f1)
            MIN=\$(echo "\$LATEST" | cut -d. -f2)
            PAT=\$(echo "\$LATEST" | cut -d. -f3)
            echo "\${MAJ}.\${MIN}.\$((PAT + 1))"
          """).trim()

          def fullTag = "${envPrefix}-v${newVersion}"
          echo "Tag : ${env.DOCKER_IMAGE}:${fullTag}"
          def viteApiUrl  = (branch == 'main') ? 'https://api-tea-main.wk-archi-o22a-15m-g1.fr' : 'https://api-tea-staging.wk-archi-o22a-15m-g1.fr'
          def viteSiteUrl = 'wk-archi-o22a-15m-g1.fr'
          sh "docker build -f Dockerfile.prod --build-arg VITE_API_URL=${viteApiUrl} --build-arg VITE_SITE_URL=${viteSiteUrl} -t ${env.DOCKER_IMAGE}:${fullTag} ." 
          env.DOCKER_FULL_TAG = fullTag
          echo "Image construite : ${env.DOCKER_IMAGE}:${fullTag}"
        }
      }
    }

    // ══════════════════════════════════════════════════════════
    // 7. DOCKER — Push sur Docker Hub
    // ══════════════════════════════════════════════════════════
    stage('Push Docker Image') {
      agent any
      steps {
        script {
          def fullTag = env.DOCKER_FULL_TAG
          withCredentials([usernamePassword(
            credentialsId: 'dockerhub-credentials',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )]) {
            sh """
              echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
              docker push ${env.DOCKER_IMAGE}:${fullTag}
              docker logout
            """
          }
          echo "Image poussee sur Docker Hub : ${env.DOCKER_IMAGE}:${fullTag}"
        }
      }
    }

    // ══════════════════════════════════════════════════════════
    // 8. CD — Déclenchement du déploiement via GitHub Actions
    // ══════════════════════════════════════════════════════════
    stage('Trigger Deployment') {
      agent any
      steps {
        script {
          def branch = env.BRANCH_NAME
          def tag    = env.DOCKER_FULL_TAG

          if (branch == 'staging' || branch == 'main') {
            def workflow = (branch == 'staging') ? 'deploy-staging.yml' : 'deploy.yml'
            def env_name = (branch == 'staging') ? 'Staging' : 'Production'
            echo "Declenchement deploiement web ${env_name} avec image ${tag}..."
            withCredentials([usernamePassword(credentialsId: 'github-pat', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
              sh """
                HTTP_CODE=\$(curl -s -o /tmp/gh_response.txt -w "%{http_code}" -X POST \
                  -H "Authorization: Bearer \$GH_TOKEN" \
                  -H "Accept: application/vnd.github+json" \
                  -H "Content-Type: application/json" \
                  "https://api.github.com/repos/Kevine-fr/Tea-web/actions/workflows/${workflow}/dispatches" \
                  -d '{"ref":"${branch}","inputs":{"image_tag":"${tag}"}}')
                echo "HTTP Status: \$HTTP_CODE"
                cat /tmp/gh_response.txt || true
                if [ "\$HTTP_CODE" = "204" ] || [ "\$HTTP_CODE" = "200" ]; then
                  echo "Deploiement web ${env_name} declenche avec le tag ${tag}"
                else
                  echo "Erreur declenchement (HTTP \$HTTP_CODE) — non bloquant"
                fi
              """
            }
          } else {
            echo "Branche ${branch} : pas de deploiement automatique."
          }
        }
      }
    }

    // ══════════════════════════════════════════════════════════
    // 9. PR — Création automatique de la PR via l'API GitHub
    // ══════════════════════════════════════════════════════════
    stage('Create Pull Request') {
      agent any
      steps {
        script {
          def branch = env.BRANCH_NAME
          if (branch != 'dev' && branch != 'staging') {
            echo "Branche ${branch} : pas de PR automatique."
            return
          }
          def base  = (branch == 'dev') ? 'staging' : 'main'
          def title = (branch == 'dev') ? '[Web] Merge dev vers staging' : '[Web] Release staging vers production'

          withCredentials([usernamePassword(credentialsId: 'github-pat', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
            sh """
              EXISTING=\$(curl -sf \
                -H "Authorization: Bearer \$GH_TOKEN" \
                -H "Accept: application/vnd.github+json" \
                "https://api.github.com/repos/Kevine-fr/Tea-web/pulls?state=open&base=${base}&head=Kevine-fr:${branch}" \
                | grep -o '"number": *[0-9]*' | head -1 | grep -o '[0-9]*' || echo "")
              if [ -n "\$EXISTING" ]; then
                echo "PR #\$EXISTING deja ouverte — ajout du label jenkins-approved."
                curl -sf -X POST \
                  -H "Authorization: Bearer \$GH_TOKEN" \
                  -H "Accept: application/vnd.github+json" \
                  -H "Content-Type: application/json" \
                  "https://api.github.com/repos/Kevine-fr/Tea-web/issues/\$EXISTING/labels" \
                  -d '{"labels":["jenkins-approved"]}' || true
              else
                RESULT=\$(curl -s -X POST \
                  -H "Authorization: Bearer \$GH_TOKEN" \
                  -H "Accept: application/vnd.github+json" \
                  -H "Content-Type: application/json" \
                  "https://api.github.com/repos/Kevine-fr/Tea-web/pulls" \
                  -d '{"title":"${title}","head":"${branch}","base":"${base}"}')
                PR_NUM=\$(echo "\$RESULT" | grep -o '"number": *[0-9]*' | head -1 | grep -o '[0-9]*' || echo "")
                if [ -z "\$PR_NUM" ]; then
                  echo "Pas de PR creee (branches identiques ou erreur API)."
                else
                  curl -sf -X POST \
                    -H "Authorization: Bearer \$GH_TOKEN" \
                    -H "Accept: application/vnd.github+json" \
                    -H "Content-Type: application/json" \
                    "https://api.github.com/repos/Kevine-fr/Tea-web/issues/\$PR_NUM/labels" \
                    -d '{"labels":["jenkins-approved"]}' || true
                  echo "PR #\$PR_NUM creee : ${branch} vers ${base}"
                fi
              fi
            """
          }
        }
      }
    }

  }

  // ══════════════════════════════════════════════════════════
  // POST — Notification email + nettoyage
  // ══════════════════════════════════════════════════════════
  post {
    success {
      node('built-in') {
        script {
          def tag    = env.DOCKER_FULL_TAG ?: 'N/A'
          def branch = env.BRANCH_NAME ?: 'N/A'
          mail(
            to:      env.NOTIFY_EMAIL,
            subject: "✅ [Jenkins] Build SUCCESS — Tea-web/${branch} #${env.BUILD_NUMBER}",
            body: """
Bonjour,

Le build Jenkins du frontend s'est terminé avec succès.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Projet   : Tea-web (React/Vite)
  Branche  : ${branch}
  Build    : #${env.BUILD_NUMBER}
  Image    : zstin4/tea-web:${tag}
  Durée    : ${currentBuild.durationString}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Détails : ${env.BUILD_URL}

Cordialement,
Jenkins CI
            """.stripIndent()
          )
        }
      }
    }

    failure {
      node('built-in') {
        script {
          def branch = env.BRANCH_NAME ?: 'N/A'
          mail(
            to:      env.NOTIFY_EMAIL,
            subject: "❌ [Jenkins] Build FAILURE — Tea-web/${branch} #${env.BUILD_NUMBER}",
            body: """
Bonjour,

Le build Jenkins du frontend a échoué.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Projet   : Tea-web (React/Vite)
  Branche  : ${branch}
  Build    : #${env.BUILD_NUMBER}
  Durée    : ${currentBuild.durationString}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consultez les logs :
${env.BUILD_URL}console

Cordialement,
Jenkins CI
            """.stripIndent()
          )
        }
      }
    }

    always {
      node('built-in') {
        script {
          try { cleanWs() } catch (e) { echo "cleanWs skipped" }
        }
      }
    }
  }
}
