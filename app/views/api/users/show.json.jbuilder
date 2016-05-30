json.user do
  json.id                 @user.id
  json.email              @user.email
  json.firstname          @user.firstname
  json.lastname           @user.lastname
  json.phonenumber        @user.phonenumber
  json.created_at         @user.created_at
  json.updated_at         @user.updated_at
  json.current_sign_in_at @user.current_sign_in_at
  json.isdeleted          @user.isdeleted
end