-- Get permissions of specific user
SELECT DISTINCT mn.*
FROM shopdev_menu as mn, (
  SELECT rome.menu_id
  FROM shopdev_user_role as usro, shopdev_role_menu as rome
  WHERE rome.role_id = usro.role_id
) AS t
WHERE mn.menu_id = t.menu_id;