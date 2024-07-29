This repository contains the code for a Banking Application Project that I worked on daily throughout Summer 2024. 
The Tech Stack Required for project installation is **React -> Java Spring Boot -> MongoDB**
**banking-java** contains my backend code, while **banking-react** contains my frontend code!

Using Spring Boot Security, the banking dashboard simulates a real banking experience once a user creates an account and completes email verification. Users can create various types of accounts, such as checking, savings, or business, and select their preferred currency type. Additionally, users can create credit cards linked to their accounts and simulate card purchases or payments based on their balance and credit limit. The dashboard visualizes transactions through a line graph, and users can convert their currency to other currencies using a currency exchange rate API. MongoDB stores the transactions, account data, and credit card information, while the Java backend manages the creation and retrieval of the appropriate documents based on database references.

Below are some images of the application.
<img width="1470" alt="Screenshot 2024-07-28 at 8 25 14 PM" src="https://github.com/user-attachments/assets/ddc5a6c6-f645-418c-8493-03bf49e49950">

<img width="1470" alt="Screenshot 2024-07-29 at 2 59 50 PM" src="https://github.com/user-attachments/assets/4c085f12-336a-4e9e-8e9c-4ba646f920a6">

<img width="1469" alt="Screenshot 2024-07-29 at 2 59 11 PM" src="https://github.com/user-attachments/assets/3272cd23-ed8a-46e7-a59d-aad856979fea">


# Project Setup Instructions

## Prerequisites
-It is reccomended to use Intellij IDEA as the IDE used to run the Java backend
-It is reccomended to use VSCode as the IDE used to run the React frontend
- Ensure you have [MongoDB](https://www.mongodb.com/try/download/community) installed locally or have access to a MongoDB instance. (I used the MongoDB Compass Application to observe my documents)
- Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed for the React front end.
- Ensure you have [Maven](https://maven.apache.org/) installed for the Spring Boot backend.
- This application uses an email verification feature, so create an email SMTP user beforehand. This [tutorial](https://youtu.be/kTcmbZqNiGw?si=0RZliftDGF7cX2l0) will help you get started.
- replace the applications.properties values in the java backend with your own credentials. Spring Mail and MongoDB connections will be needed, and can be found with tutorials online.

## React Front End Setup

1. **Navigate to the React project directory**:
    ```bash
    cd banking-react
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm start
    ```

## Spring Boot Backend Setup

1. **Navigate to the Spring Boot project directory**:
    ```bash
    cd banking-java
    ```

2. **Build the project and install dependencies**:
    ```bash
    mvn clean install
    ```
Once you have the backend and frontend running, the project should be available to view through localhost! Tip: Use Intellij IDEA for the java backend and VSCode for the react frontend!

3. **Run the application**:
    ```bash
    mvn spring-boot:run
    ```

