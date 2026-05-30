pipeline{
  agent any
  stages{
    stage("test"){
      steps{
        echo "running testing...."
      }
    }
    stage("build"){
      steps{
        echo "build artifact"
      }
    }
    stage("publish"){
      steps{
        echo "publish artifact to docker hub"
      }
    }
    stage("deploy"){
      steps{
        echo "deploying app  to ec2"
      }
    }
  }
}
