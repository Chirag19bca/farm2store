-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2025 at 09:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `farm2store`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `firstname` varchar(80) NOT NULL,
  `lastname` varchar(80) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(20) NOT NULL,
  `phone` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `firstname`, `lastname`, `email`, `password`, `phone`) VALUES
(101, 'Chirag', 'Sadhu', 'chirag_5012@gmail.com', 'Chess#12', 9537412456),
(102, 'Dhruvil', 'Lodha', 'dhruvil_5020@gmail.com', 'Dev@1234', 7990495457);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(801, 'Fruits'),
(802, 'Vegetables'),
(803, 'Grains');

-- --------------------------------------------------------

--
-- Table structure for table `farmer`
--

CREATE TABLE `farmer` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(60) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `phone` decimal(10,0) NOT NULL,
  `address` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmer`
--

INSERT INTO `farmer` (`id`, `firstname`, `lastname`, `email`, `password`, `phone`, `address`) VALUES
(301, 'chirag', 'Sadhu ', 'chirag@gmail.com', 'Chirag@2', 9537412455, 'B-304,vijaynagar park, mahesana'),
(302, 'Dhruvil', 'Lodha', 'dhruvil@gmail.com', 'Dhruvil@25', 9637412455, 'D-302 , vijay park , mahesana '),
(315, 'Akshat', 'rana', 'akshat52@gmail.com', 'Akshat@52', 9563217485, '302 , jagmanpur ,gandhinagar'),
(316, 'Manan', 'soni', 'manan56@gmail.com', 'Manan@56', 9879637011, '202 , Jetalpur , Dholka ');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('retailer','farmer') NOT NULL,
  `feedback_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `target_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `user_type`, `feedback_text`, `created_at`, `target_user_id`) VALUES
(3, 301, 'farmer', 'BAD DELER\n', '2025-04-13 11:36:46', 202),
(5, 205, 'retailer', 'it sell bad product', '2025-04-13 13:00:49', 315),
(6, 206, 'retailer', 'not good product as price', '2025-04-15 06:05:08', 315);

-- --------------------------------------------------------

--
-- Table structure for table `ordersr`
--

CREATE TABLE `ordersr` (
  `id` int(11) NOT NULL,
  `retailer_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `farmer_status` enum('Pending','Shipped','Delivered') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `retailer_status` enum('Pending','Completed','Shipped') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ordersr`
--

INSERT INTO `ordersr` (`id`, `retailer_id`, `farmer_id`, `product_id`, `quantity`, `total_price`, `farmer_status`, `created_at`, `retailer_status`) VALUES
(1, 204, 301, 903, 6, 360.00, 'Delivered', '2025-03-27 06:16:51', 'Completed'),
(2, 204, 301, 902, 80, 3200.00, 'Delivered', '2025-03-27 06:37:26', 'Completed'),
(3, 204, 302, 908, 50, 2750.00, 'Delivered', '2025-03-27 10:00:00', 'Completed'),
(4, 204, 301, 902, 1, 40.00, 'Pending', '2025-03-27 11:36:40', 'Pending'),
(5, 205, 301, 903, 1, 60.00, 'Pending', '2025-03-28 10:57:32', 'Pending'),
(6, 205, 301, 909, 15, 450.00, 'Delivered', '2025-03-28 10:57:32', 'Completed'),
(7, 205, 301, 907, 1, 35.00, 'Pending', '2025-03-28 10:57:32', 'Pending'),
(8, 204, 301, 902, 1, 40.00, 'Shipped', '2025-04-13 06:01:01', 'Shipped'),
(9, 204, 301, 903, 44, 2640.00, 'Pending', '2025-04-13 06:01:01', 'Pending'),
(10, 204, 302, 904, 1, 45.00, 'Pending', '2025-04-13 06:01:20', 'Pending'),
(11, 205, 302, 905, 25, 1125.00, 'Pending', '2025-04-14 05:09:45', 'Pending'),
(12, 206, 301, 901, 1, 50.00, 'Delivered', '2025-04-14 05:51:35', 'Completed'),
(13, 206, 301, 902, 28, 1120.00, 'Pending', '2025-04-15 05:59:59', 'Pending'),
(14, 206, 301, 902, 12, 480.00, 'Pending', '2025-04-15 06:13:00', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  `image` longtext NOT NULL,
  `quantity` varchar(10) NOT NULL,
  `unitprice` int(11) NOT NULL,
  `farmer_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `image`, `quantity`, `unitprice`, `farmer_id`, `category_id`) VALUES
(901, 'Apple', 'Fresh red apples', '/images/apple.jpg', '64', 50, 301, 801),
(902, 'Apple', 'Crisp apples from hill farm', '/images/apple.jpg', '80', 55, 302, 801),
(903, 'Banana', 'Organic bananas', '/images/banana.jpg', '100', 30, 301, 801),
(904, 'Banana', 'Sweet bananas', '/images/banana.jpg', '90', 28, 315, 801),
(905, 'Mango', 'Alphonso mangoes', '/images/mango.jpg', '50', 60, 302, 801),
(906, 'Orange', 'Juicy oranges', '/images/orange.jpg', '75', 40, 316, 801),
(907, 'Strawberry', 'Farm fresh strawberries', '/images/strawberry.jpg', '40', 70, 301, 801),
(908, 'Tomato', 'Red ripe tomatoes', '/images/tomato.jpg', '100', 25, 301, 802),
(909, 'Carrot', 'Crunchy carrots', '/images/carrot.jpg', '85', 20, 315, 802),
(910, 'Broccoli', 'Fresh broccoli', '/images/broccoli.jpg', '60', 35, 302, 802),
(911, 'Capsicum', 'Green capsicum', '/images/capsicum.jpg', '70', 30, 301, 802),
(912, 'Cucumber', 'Cool cucumbers', '/images/cucumber.jpg', '95', 22, 316, 802),
(913, 'Rice', 'Basmati rice', '/images/rice.jpg', '150', 45, 302, 803),
(914, 'Wheat', 'Whole wheat grains', '/images/wheat.jpg', '180', 35, 301, 803),
(915, 'Corn', 'Sweet corn', '/images/corn.jpg', '90', 40, 315, 803),
(916, 'Barley', 'Clean barley grains', '/images/barley.jpg', '100', 38, 316, 803),
(917, 'Oats', 'Organic oats', '/images/oats.jpg', '70', 42, 302, 803),
(918, 'Potato', 'Farm potatoes', '/images/potato.jpg', '100', 18, 315, 802),
(919, 'Onion', 'Red onions', '/images/onion.jpg', '120', 20, 301, 802),
(920, 'Garlic', 'Spicy garlic', '/images/garlic.jpg', '90', 25, 316, 802),
(921, 'Ginger', 'Fresh ginger', '/images/ginger.jpg', '80', 28, 302, 802),
(922, 'Peas', 'Green peas', '/images/peas.jpg', '60', 30, 315, 802),
(923, 'Pumpkin', 'Sweet pumpkin', '/images/pumpkin.jpg', '40', 35, 301, 802),
(924, 'Spinach', 'Fresh spinach', '/images/spinach.jpg', '50', 18, 302, 802),
(925, 'Cabbage', 'Green cabbage', '/images/cabbage.jpg', '70', 22, 316, 802),
(926, 'Soybeans', 'Protein-rich soybeans', '/images/soybeans.jpg', '85', 45, 301, 803),
(927, 'Lentils', 'Masoor dal', '/images/lentils.jpg', '75', 38, 302, 803),
(928, 'Chickpeas', 'Kabuli chana', '/images/chickpeas.jpg', '80', 40, 315, 803),
(929, 'Apple', 'Red apples', '/images/apple.jpg', '60', 53, 315, 801),
(930, 'Mango', 'Kesar mangoes', '/images/mango.jpg', '65', 58, 316, 801),
(931, 'Banana', 'Fresh bananas', '/images/banana.jpg', '90', 29, 316, 801),
(932, 'Orange', 'Nagpur oranges', '/images/orange.jpg', '80', 42, 302, 801),
(933, 'Tomato', 'Juicy tomatoes', '/images/tomato.jpg', '110', 27, 302, 802),
(934, 'Carrot', 'Orange carrots', '/images/carrot.jpg', '95', 21, 301, 802),
(935, 'Cucumber', 'Sliced cucumber packs', '/images/cucumber.jpg', '60', 26, 315, 802),
(936, 'Rice', 'Organic rice', '/images/rice.jpg', '140', 47, 315, 803),
(937, 'Wheat', 'Hard wheat', '/images/wheat.jpg', '160', 36, 316, 803),
(938, 'Corn', 'Boiled corn packs', '/images/corn.jpg', '70', 41, 302, 803),
(939, 'Barley', 'Barley kernels', '/images/barley.jpg', '90', 39, 301, 803),
(940, 'Oats', 'Rolled oats', '/images/oats.jpg', '75', 43, 315, 803),
(941, 'Potato', 'Big potatoes', '/images/potato.jpg', '130', 19, 316, 802),
(942, 'Onion', 'Pink onions', '/images/onion.jpg', '100', 21, 302, 802),
(943, 'Garlic', 'Organic garlic', '/images/garlic.jpg', '85', 26, 315, 802),
(944, 'Ginger', 'Aromatic ginger', '/images/ginger.jpg', '90', 29, 301, 802),
(945, 'Peas', 'Frozen peas', '/images/peas.jpg', '50', 31, 302, 802),
(946, 'Pumpkin', 'Yellow pumpkin', '/images/pumpkin.jpg', '45', 36, 316, 802),
(947, 'Spinach', 'Leafy spinach', '/images/spinach.jpg', '55', 19, 301, 802),
(948, 'Cabbage', 'Crisp cabbage', '/images/cabbage.jpg', '65', 23, 302, 802),
(949, 'Soybeans', 'Field soybeans', '/images/soybeans.jpg', '95', 46, 315, 803),
(950, 'Lentils', 'Toor dal', '/images/lentils.jpg', '85', 39, 316, 803);

-- --------------------------------------------------------

--
-- Table structure for table `retailer`
--

CREATE TABLE `retailer` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(60) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `phone` decimal(10,0) NOT NULL,
  `shop_name` varchar(90) NOT NULL,
  `shop_address` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `retailer`
--

INSERT INTO `retailer` (`id`, `firstname`, `lastname`, `email`, `password`, `phone`, `shop_name`, `shop_address`) VALUES
(201, 'jethalal', 'gada', 'jetha@gmail.com', 'Jetha#80', 9837412455, 'gadha fruits shop', 'near power mall,mubai,india'),
(202, 'jethabhai', 'soni', 'jethabhai@gmail.com', 'Jetha$40', 9737412455, 'jetha ka thela', 'near power mall,mubai,india'),
(204, 'chirag', 'Kapoor ', 'ChiragK@gmail.com', 'Chirag#12', 9537412456, 'github shop', 'near chatgpt'),
(205, 'Dhruvil', 'Shah', 'DhruvilShah@gmail.com', 'Dhruvil$25', 7845956725, 'Fruit cart', 'near maninager,vatva,380044'),
(206, 'Gidwani', 'Karan', 'karan12@gmail.com', 'Karan@1234', 1234567890, 'chirag complex', 'navrangpura');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `farmer`
--
ALTER TABLE `farmer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ordersr`
--
ALTER TABLE `ordersr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `retailer_id` (`retailer_id`),
  ADD KEY `farmer_id` (`farmer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Farmer_id` (`farmer_id`),
  ADD KEY `Category_id` (`category_id`);

--
-- Indexes for table `retailer`
--
ALTER TABLE `retailer`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `farmer`
--
ALTER TABLE `farmer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=317;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ordersr`
--
ALTER TABLE `ordersr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=951;

--
-- AUTO_INCREMENT for table `retailer`
--
ALTER TABLE `retailer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ordersr`
--
ALTER TABLE `ordersr`
  ADD CONSTRAINT `ordersr_ibfk_1` FOREIGN KEY (`retailer_id`) REFERENCES `retailer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ordersr_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ordersr_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`id`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
