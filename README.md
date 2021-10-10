# Pulumi
https://www.pulumi.com/

# Creating new pulumi project for AWS with Typescript
```bash 
mkdir <folder>
cd <folder>
pulumi new aws-typescript --name helloworld
npm ci
```
### CLI
https://www.pulumi.com/docs/reference/cli/

# What is Stack?
Every Pulumi program is deployed to a stack. A stack is an isolated, independently configurable instance of a Pulumi program. Stacks are commonly used to denote different phases of development (such as development, staging, and production) or feature branches (such as feature-x-dev).

# Creating a new stack
```bash
pulumi stack init <name>
```