# Serverless Travels Diary App
Simply plan and store informations about your travels.

# Features

- Add/Update Travel
- Delete Travel
- Add Image To Travel
- Show Travel Images

# How to run the application

## Backend

To deploy application run the following commands:

```
cd backend
npm install
sls deploy -v
```


## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

# Screenshots

### Index Before Login

![Alt text](images/IndexBeforeLogin.png?raw=true "Before Login")

### Index After Login

![Alt text](images/IndexAfterLogin.png?raw=true "After Login")

### Create Travel

![Alt text](images/CreateTravel.png?raw=true "Create Travel")

### Update Travel

![Alt text](images/UpdateTravel.png?raw=true "Update Travel")

### Show Travel Images

![Alt text](images/TravelImages.png?raw=true "Show Travel Images")

### Upload Travel Image

![Alt text](images/UploadImage.png?raw=true "Upload Travel Image")
