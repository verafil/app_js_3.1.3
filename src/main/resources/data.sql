
INSERT INTO `users` (`id`, `username`, `password`, `last_name`, `name`, `age`)
VALUES
(1,'admin','$2a$12$LJmVZcm7g/dl4fII16sUN.eFp2h0j8NjOmtwQ3fzx2O.QXElsyA6O', 'vera', 'olegovna', 33),
(2,'user','$2a$12$LJmVZcm7g/dl4fII16sUN.eFp2h0j8NjOmtwQ3fzx2O.QXElsyA6O', 'sergey', 'sergeevich', 33);

INSERT INTO `roles` (`id`, `name`)
VALUES
(1,'ROLE_ADMIN'),
(2,'ROLE_USER');

insert into users_roles
values
(1, 1),
(1, 2),
(2, 2);