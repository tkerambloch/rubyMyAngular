module Api
  class UsersController < Api::BaseController

    # PUT /api/{plural_resource_name}/1/update_password
    def update_password
      @user = User.find(params[:id])
      if @user.reset_password!(params[:password],params[:password_confirm])
        @user.save
        render :show
      else
        render json: get_resource.errors, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :firstname, :lastname, :phonenumber, :current_sign_in_at, :created_at, :updated_at, :isdeleted)
    end

    def query_params
      params.permit(:email, :password, :firstname, :lastname, :phonenumber, :current_sign_in_at, :created_at, :updated_at, :isdeleted)
    end

  end
end