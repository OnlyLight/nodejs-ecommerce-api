-- 1. shopdev_user
DROP TABLE IF EXISTS `shopdev_user`;
CREATE TABLE `shopdev_user` (
  user_id INT NOT NULL AUTO_INCREMENT COMMENT 'user id',
  user_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'user name',
  user_email VARCHAR(255) NULL DEFAULT NULL COMMENT 'user email',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shopdev_user` (user_name, user_email) VALUES
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com'),
('Alice Brown', 'alice.brown@example.com'),
('Bob Johnson', 'bob.johnson@example.com'),
('Emma Davis', 'emma.davis@example.com');

-- 2. shopdev_role
DROP TABLE IF EXISTS `shopdev_role`;
CREATE TABLE `shopdev_role` (
  role_id INT NOT NULL AUTO_INCREMENT COMMENT 'role id',
  role_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'role name',
  role_description VARCHAR(255) NULL DEFAULT NULL COMMENT 'role description',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shopdev_role` (role_name, role_description) VALUES
('Admin', 'Full access to all features'),
('Editor', 'Can edit content but limited admin rights'),
('Viewer', 'Read-only access');

-- 3. shopdev_menu (Updated)
DROP TABLE IF EXISTS `shopdev_menu`;
CREATE TABLE `shopdev_menu` (
  menu_id INT NOT NULL AUTO_INCREMENT COMMENT 'menu id',
  menu_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'menu name',
  menu_pid VARCHAR(255) NULL DEFAULT NULL COMMENT 'menu pid number',
  menu_path VARCHAR(255) NULL DEFAULT NULL COMMENT 'menu path',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shopdev_menu` (menu_name, menu_pid, menu_path) VALUES
('Dashboard', NULL, '/dashboard'),
('Users', NULL, '/users'),
('User Settings', '2', '/users/settings'),
('Reports', NULL, '/reports');

-- 4. shopdev_role_menu
DROP TABLE IF EXISTS `shopdev_role_menu`;
CREATE TABLE `shopdev_role_menu` (
  role_id INT NOT NULL COMMENT 'role id',
  menu_id INT NOT NULL COMMENT 'menu id',
  PRIMARY KEY (`role_id`, `menu_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shopdev_role_menu` (role_id, menu_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), -- Admin
(2, 1), (2, 2), (2, 3),       -- Editor
(3, 1), (3, 4);              -- Viewer

-- 5. shopdev_user_role
DROP TABLE IF EXISTS `shopdev_user_role`;
CREATE TABLE `shopdev_user_role` (
  user_id INT NOT NULL COMMENT 'user id',
  role_id INT NOT NULL COMMENT 'role id',
  PRIMARY KEY (`user_id`, `role_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shopdev_user_role` (user_id, role_id) VALUES
(1, 1), -- John as Admin
(2, 2), -- Jane as Editor
(3, 3), -- Alice as Viewer
(4, 2), (4, 3), -- Bob as Editor and Viewer
(5, 3); -- Emma as Viewer
