-- Create the database
CREATE DATABASE IF NOT EXISTS food_app_db;

USE food_app_db;

-- Create User table
CREATE TABLE IF NOT EXISTS User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(100),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Restaurant table
CREATE TABLE IF NOT EXISTS Restaurant (
    Restaurant_ID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    logoURL VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

 
 
 create table Order_Details (
  Order_ID int primary key auto_increment,
    User_ID int not null,
    Restaurant_ID int not null,
  Price decimal(10,2) not null,
  address varchar(255),
    Payment_Method enum('cash', 'credit_card', 'debit_card') DEFAULT 'cash',
    status enum('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
  CreatedAt timestamp default current_timestamp,
  UpdatedAt timestamp default current_timestamp on update current_timestamp,
    
    foreign key (User_ID) references User(User_ID) on delete cascade,
    foreign key (Restaurant_ID) references Restaurant(Restaurant_ID) on delete cascade
);


create table Category (
  Category_ID int primary key auto_increment,
    Name varchar(100) not null,
    CreatedAt timestamp default current_timestamp,
  UpdatedAt timestamp default current_timestamp on update current_timestamp
);

create table Food (
  Food_ID int primary key auto_increment,
    Restaurant_ID int not null,
    Category_ID int not null,
    Name varchar(100) not null,
    Description varchar(255),
    Price decimal(10,2) not null,
    imageURL varchar(255),
    is_active boolean default true,
    
  foreign key (Restaurant_ID) references Restaurant(Restaurant_ID) on delete cascade,
  foreign key (Category_ID) references Category(Category_ID) on delete cascade,
  
    index index_restaurant (Restaurant_ID),
    index index_category (Category_ID),
    index index_name (Name)
);

create table Order_Item (
  Order_Item_ID int primary key auto_increment ,
    Order_ID int not null,
    Food_ID int not null,
    Quantity int not null default 1,
    Price decimal(10,2) not null,
    Subtotal decimal(10,2) generated always as (Quantity*Price) stored,
    
    foreign key (Order_ID) references Order_Details(Order_ID) on delete cascade,
    foreign key (Food_ID) references Food(Food_ID) on delete restrict,
    
  index index_order (Order_ID),
    index index_food (Food_ID)
);

create table Payment(
  Payment_ID int primary key auto_increment,
    Order_ID int not null,
    Amount decimal(10,2) not null,
    Payment_method enum('cash', 'credit_card', 'debit_card'),
    Status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  Payment_Date timestamp default current_timestamp,
    
    foreign key (Order_ID) references Order_Details(Order_ID) on delete cascade
);

create table Review (
  Review_ID int primary key auto_increment,
    Rating int not null check (Rating>=1 and Rating<=5),
    Comment text,
    User_ID int not null,
    Restaurant_ID int not null,
    Food_ID int ,
    CreatedAt timestamp default current_timestamp,
  UpdatedAt timestamp default current_timestamp on update current_timestamp,
    
    foreign key (User_ID) references User(User_ID) on delete cascade,
    foreign key (Restaurant_ID) references Restaurant(Restaurant_ID) on delete cascade,
    foreign key (Food_ID) references Food(Food_ID) on delete set null
);


INSERT INTO Restaurant (name, email, password, phone, address, logoURL)
VALUES 
('Delicious Bites', 'contact@deliciousbites.com', 'myRestaurant55', '01000000000',
'12 Nile Street, Cairo, Egypt', 'https://share.google/images/p309GotAcUKr7JUkS');

INSERT INTO Category (Name) VALUES
('Pizza'),
('Burger'),
('Main Courses'),
('Sandwiches'),
('Desserts'),
('Beverages');

INSERT INTO Food (Restaurant_ID, Category_ID, Name, Description, Price, imageURL)
VALUES
(1, 1, 'Margherita Pizza', 'Classic tomato sauce with mozzarella cheese', 120.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846472/margeritta_pdebby.jpg'),
(1, 1, 'Pepperoni Pizza', 'Pepperoni slices with cheese', 150.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846480/pepperoni_pjsd8h.jpg'),
(1, 1, 'BBQ Chicken Pizza', 'Grilled chicken with BBQ sauce', 170.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846671/BBQ_Chicken_Delight_1_tq1pus.jpg');

INSERT INTO Food (Restaurant_ID, Category_ID, Name, Description, Price, imageURL)
VALUES
(1, 2, 'Classic Beef Burger', 'Juicy beef patty with lettuce and tomato', 95.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846749/Classic_Beef_Burger_reef5p.jpg'),
(1, 2, 'Cheese Burger', 'Beef patty topped with cheddar cheese', 110.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846885/Bacon_and_Cheese_Heaven_rqnd1a.jpg'),
(1, 2, 'Crispy Chicken Burger', 'Crispy chicken fillet with mayo', 105.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846466/chicken-burger-2953388_1280_uvdlpa.jpg');

INSERT INTO Food (Restaurant_ID, Category_ID, Name, Description, Price, imageURL)
VALUES
(1, 3, 'Grilled Chicken Plate', 'Served with rice and vegetables', 160.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846481/WhatsApp_Image_2025-12-03_at_23.23.40_76454458_ar8qzn.jpg'),
(1, 3, 'Beef Steak', 'Tender steak with mushroom sauce', 250.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846476/steak-3640560_1280_nh8dra.jpg'),
(1, 3, 'Seafood Pasta', 'Mixed seafood with creamy sauce', 190.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846480/seafood_pasta_we9jw9.jpg');

INSERT INTO Food (Restaurant_ID, Category_ID, Name, Description, Price, imageURL)
VALUES
(1, 4, 'Club Sandwich', 'Triple-layer chicken & cheese sandwich', 85.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846464/club-sandwich_habeyl.jpg'),
(1, 4, 'Tuna Sandwich', 'Fresh tuna mix with mayo', 75.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846477/tuna_qds3zg.jpg'),
(1, 4, 'Beef Shawarma Wrap', 'Middle Eastern beef wrap', 90.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846473/shawarma_vwanoh.jpg');

INSERT INTO Food (Restaurant_ID, Category_ID, Name, Description, Price, imageURL)
VALUES
(1, 5, 'Chocolate Cake', 'Rich chocolate layered cake', 70.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846465/chocolatecake_kr5bc9.jpg'),
(1, 5, 'Cheesecake', 'Creamy classic cheesecake', 80.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846462/cheesecake-1-22_eawzu6.jpg'),
(1, 5, 'Ice Cream Cup', 'Vanilla, chocolate or strawberry', 40.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846469/IcecreamBwl12_rmcyso.jpg');

INSERT INTO Food (Restaurant_ID, Category_ID, Name, Description, Price, imageURL)
VALUES
(1, 6, 'Coca-Cola', 'Cold soft drink', 20.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846464/cola_ltrbnp.jpg'),
(1, 6, 'Fresh Orange Juice', 'Squeezed orange juice', 35.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846472/orangeJuice_kymbsw.jpg'),
(1, 6, 'Iced Coffee', 'Coffee with ice and milk', 45.00, 'https://res.cloudinary.com/dcqluerz5/image/upload/v1764846471/icecoffee_mjdfen.jpg');

