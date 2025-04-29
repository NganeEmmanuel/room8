import jenkins.model.*
import javaposse.jobdsl.plugin.ExecuteDslScripts

def jobDslScript = '''
pipelineJob("room8-ci-cd") {
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        url("https://github.com/NganeEmmanuel/room8.git")
                    }
                    branches("main")
                }
            }
            scriptPath("Jenkinsfile")
        }
    }
}
'''

Jenkins.instance.getExtensionList(ExecuteDslScripts.class)[0 as java.lang.String] //[0]
        .executeDslScripts(jobDslScript)
