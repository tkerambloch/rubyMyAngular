json.count @users.total_count

json.users @users do |user|
  json.id         user.id
  json.email      user.email
  json.firstname  user.firstname
  json.lastname   user.lastname
  json.isdeleted  user.isdeleted
end
