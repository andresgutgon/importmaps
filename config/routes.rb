Rails.application.routes.draw do
  get '/hola', to: 'main#hola', as: :hello
  root 'main#index'
end
