from pydantic import BaseModel

class UserSignup(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
