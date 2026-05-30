pipeline{
  agent any
  stages{
    stage("test"){
      step{
        sh echo "running testing...."
      }
    }
    stage("build"){
      steps{
        sh echo "build artifact"
      }
    }
    stage("publish"){
      steps{
        sh echo "publish artifact to docker hub"
      }
    }
    stage("deploy"){
      steps{
        sh echo "deploying app  to ec2"
      }
    }
  }
}
