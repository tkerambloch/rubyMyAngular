Rails.application.routes.draw do

  root 'application#angular'

  devise_for :users, :only => [:session]

  namespace :api do
    authenticate :user do
      resources :users, defaults: {format: :json} do
        member do
          put 'update_password'
        end
      end
    end
  end

end