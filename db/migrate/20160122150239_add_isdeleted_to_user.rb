class AddIsdeletedToUser < ActiveRecord::Migration
  def change
    add_column :users, :isdeleted, :boolean, :default => false
  end
end
