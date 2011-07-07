TwitterEver::Application.routes.draw do
  resources :logins

  resources :admins

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  match 'show_user_dashboard.html' => 'admins#show_user_dashboard'
  match 'test_page.html' => 'logins#test_page'
  match 'benefits.html' => 'admins#benefits'
  match 'features.html' => 'admins#features'
  match 'welcome_page.html' => 'admins#welcome_page'
  match 'screenshots.html' => 'admins#screenshots'
  match 'login_to_evernote' => 'admins#login_to_evernote'
  match 'redirect' => 'admins#redirect'
  match 'reset' => 'admins#reset'
  match 'logout' => 'admins#logout'
  match 'redirect_callback' => 'admins#redirect_callback'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
   root :to => "admins#welcome_page"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
