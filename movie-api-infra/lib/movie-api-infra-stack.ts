import { Stack, StackProps, aws_ecs_patterns, aws_ecs as ecs, aws_ec2 as ec2, aws_ssm as ssm } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

export class MovieApiInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Creating an ECS cluster
    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc: ec2.Vpc.fromLookup(this, 'vpc', {
        vpcId: 'vpc-037b1138ae24c3cf9'
      }),
      clusterName: `acme-movie-ror-api-cluster`
    })

    const dbHost = ssm.StringParameter.fromStringParameterName(this, 'dbHost', '/acme/demo/db/host')

    const dbPassword = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'dbPassword', {
      parameterName: '/acme/demo/db/password'
    })

    const masterKey = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'masterKey', {
      parameterName: '/acme/demo/api/movie/key'
    })

    const loadBalancedFargateService = new aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, 'service', {
      cluster,
      memoryLimitMiB: 2048,
      cpu: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../', "movie-api")),
        containerName: 'movie-api',
        containerPort: 3000,
        environment: {
          MOVIE_API_DATABASE_HOST: dbHost.stringValue,
          MOVIE_API_DATABASE_USERNAME: 'postgres',
          MOVIE_API_DATABASE_PORT: '5432'
        },
        secrets: {
          MOVIE_API_DATABASE_PASSWORD: ecs.Secret.fromSsmParameter(dbPassword),
          RAILS_MASTER_KEY: ecs.Secret.fromSsmParameter(masterKey)
        }
      },
      serviceName: 'movie-api-service',
      assignPublicIp: true,
    });
    
    loadBalancedFargateService.targetGroup.configureHealthCheck({
      path: "/api/movies",
      port: "3000"
    });

    new ssm.StringParameter(this, 'movieApiUrl', {
      parameterName: '/acme/demo/api/movie/endpoint',
      description: 'Movie API Endpoint URL',
      stringValue: `http://${loadBalancedFargateService.loadBalancer.loadBalancerDnsName}`
    })

  }
}
