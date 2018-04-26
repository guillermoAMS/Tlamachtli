CREATE TABLE Users (
  userID INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  altEmail VARCHAR(255) NULL,
  passwrd VARCHAR(64) NOT NULL,
  fName VARCHAR(35) NOT NULL,
  mName VARCHAR(35) NULL,
  lName VARCHAR(35) NOT NULL,
  dob DATE NOT NULL
);

CREATE TABLE Address (
  addressID INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  userID INT UNSIGNED NOT NULL,
  name VARCHAR(105) NOT NULL,
  line1 VARCHAR(35) NOT NULL,
  line2 VARCHAR(35) NULL,
  zip VARCHAR(10) NOT NULL,
  city VARCHAR(35) NOT NULL,
  state VARCHAR(35) NOT NULL,
  country VARCHAR(35) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  deleted TINYINT(1) NOT NULL,
  FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Craftsman (
  craftsmanID INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  dateAdded DATE NOT NULL,
  fName VARCHAR(35) NOT NULL,
  mName VARCHAR(35) NULL,
  lName VARCHAR(35) NOT NULL,
  email VARCHAR(255) NULL,
  telephone VARCHAR(20) NULL,
  city VARCHAR(35) NOT NULL,
  state VARCHAR(35) NOT NULL,
  country VARCHAR(35) NOT NULL,
  bio TEXT NULL,
  anonymous TINYINT(1) NOT NULL
);

CREATE TABLE Product (
  productID INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  craftsmanID INT UNSIGNED NOT NULL,
  dateAdded DATE NOT NULL,
  name VARCHAR(128) NOT NULL,
  price FLOAT(9,2) NOT NULL,
  description TEXT NOT NULL,
  score FLOAT NOT NULL,
  stock SMALLINT UNSIGNED NOT NULL,
  FOREIGN KEY (craftsmanID) REFERENCES Craftsman(craftsmanID)
);

CREATE TABLE Comment (
  userID INT UNSIGNED NOT NULL,
  productID INT UNSIGNED NOT NULL,
  score FLOAT NOT NULL,
  datePub DATE NOT NULL,
  comment TEXT NOT NULL,
  FOREIGN KEY (userID) REFERENCES Users(userID),
  FOREIGN KEY (productID) REFERENCES Product(productID),
  PRIMARY KEY (userID, productID, datePub)
);

INSERT INTO Users(email, altEmail, passwrd, fName, mName, lName, dob)
VALUES ('guillermoams@hotmail.com', NULL, 'cookies23',   'Guillermo', 'Alberto', 'Mendoza Soni',     '1995-02-22'),
       ('maCarmen_79@hotmail.com',  NULL, '1234567890',  'Maria',     'Carmen',  'Montalvo Ruiz',    '1979-05-10'),
       ('obi1kenobi@gmail.com',     NULL, 'hellothere',  'Obi-Wan',   NULL,      'Kenobi',           '1971-03-31'),
       ('elda.quiroga@gmail.com',   NULL, 'thebeemovie', 'Elda',      NULL,      'Quiroga Gonzalez', '1970-11-07');

INSERT INTO Address(userID, name, line1, line2, zip, city, state, country, telephone, deleted)
VALUES  (1, 'Guillermo Mendoza Soni', 'Rosario #42',             'Altavista',                     '64840', 'Monterrey', 'Nuevo Leon',       'Mexico', '2711143968', 0),
        (1, 'Larissa Mendoza Soni',   'Av. 15-B, #2408',         'Fraccionamiento Nuevo Cordoba', '94550', 'Cordoba',   'Veracruz',         'Mexico', '2717165506', 0),
        (1, 'Guillermo Mendoza',      'Cravioto #9',             'Ciudad Satélite',               '53100', 'Naucalpan', 'Estado de Mexico', 'Mexico', '015553938720', 0),
        (1, 'El roomie',              'Departamentos Alce #404', 'Altavista',                     '64840', 'Monterrey', 'Nuevo Leon',       'Mexico', '2711552986', 0);

INSERT INTO Craftsman (dateAdded, fName, mName, lName, email, telephone, city, state, country, bio, anonymous)
VALUES ('2018-02-20',
        'Pedro',
        NULL,
        'Vazquez Torres',
        NULL, '9512364114',
        'Mitla', 'OAX', 'MEX',
        'Pedro empezo a trabajar con pulseras desde chiquito, y poco a poco fue experimentado con otros materiales hasta convertirse en experto en hacer vasijas de barro negro',
        0),

       ('2018-03-10',
        'Aitana',
        NULL,
        'de Jesus Flores',
        NULL, '3895628366',
        'Sayulita', 'NAY', 'MEX',
        'Aitana lleva mas de 40 anos haciendo alfombras y manteles. Desde muy pequena se intereso en ayudarle a su madre y su abuela a hacer tapetes',
         0),

       ('2018-01-11',
        'Luis',
        'Angel',
        'Lopez Jimenez',
        'luislo@hotmail.com', '2718392601',
        'Papantla', 'VER', 'MEX',
        NULL,
        1),

       ('2018-03-18',
        'Maria',
        'Camila',
        'de la Rosa Fuentes',
        NULL, '4739862044',
        'Mineral de Pozos', 'GUA', 'MEX',
        'Se dedica a la elaboracion de figuras etnicas de su estado y de la cultura mexicana en general',
        0);

INSERT INTO Product(craftsmanID, dateAdded, name, price, description, score, stock)
VALUES (1, '2018-04-15', 'Porta vela de barro negro', 50.00, 'Contiene una vela con olor a naranja, dentro de un vaso elaborado de barro negro', 4.6, 30),
       (1, '2018-02-22', 'Jarron con motivos florales', 570.00, 'El jarron mide aproximadamente 50cm de alto', 4.1, 7),
       (2, '2018-04-18', 'Mantel redondo de colores', 325.00, 'Mantel hecho a mano con canamo y algodon reciclado', 3.8, 2),
       (2, '2018-03-15', 'Tapete de yute', 899.00, 'Alfombra de yute de varios colores', 4.9, 1),
       (3, '2018-01-20', 'Ramo de vainilla', 700.00, '100 gramos de varas de vainilla secas', 5.0, 15),
       (3, '2018-01-03', 'Mariposa de vainilla', 210.00, 'Esta mariposa fue elaborada con fibras de varas de vainilla', 4.5, 13),
       (4, '2018-03-17', 'Corazon cromado', 78.00, 'Corazon hecho de laton aves pintas', 3.2, 100),
       (4, '2018-04-20', 'Chiles verdes de laton', 45.00, 'Tres chiles verde hechos de laton. Cuenta con un orificio en la parte superior para colgarlos', 3.8, 100);

INSERT INTO Comment(userID, productID, score, datePub, comment)
VALUES (1, 8, 5.0, '2018-04-26', 'Me encanto, todos me dicen lo bonito que están. Súper recomiendo a esta artesana tiene muy bonitos diseños y aparte muy creativos.'),
       (2, 8, 3.0, '2018-04-25', 'Si están padres los diseños de esta artesana lo único que no me gusta es que la mayoría de sus cosas son de ojalata y si no tiene el cuidado adecuado se oxidan.'),
       (3, 8, 3.0, '2018-04-26', 'Se me calleron sin querer al agua y se oxidaron; Queda como bonito adorno en mi cocina.'),
       (4, 8, 5.0, '2018-04-26', 'El producto en si esta muy bien, me gusto el detalle que te incluyen, son un poco mas grandes de lo que creí pero cumplen, las puse en una pulsera pero esta muy grande, aun así me gustaron.'),

       (1, 7, 3.0, '2018-03-25', 'Esta muy bonito el producto pero lo que no me gusta es que se oxida bien rápido ya que lo ocupe como llavero para mi bolsa y apenas duro unas semanas y ya se veía viejo, de ahí en fuera tienen muy bonitos diseños.'),
       (2, 7, 5.0, '2018-03-29', 'Esta muy padre yo compre varios y los utilicé como adornos en la casa, le da un toque más mexicano y todos me lo chulean, de verdad súper recomendado!!!'),
       (3, 7, 5.0, '2018-04-01', 'Me gusto mucho su diseño lo use como collar y queda fantástico'),
       (4, 7, 2.0, '2018-04-15', 'Esperaba que fuera más grande , la entrega fue muy rápida.'),

       (1, 6, 4.0, '2018-01-21', 'Muy bonito y todo cuando lo cuelgas o lo pones recargado desprende un olor bien bonito y aromatiza la habitación, lo único malo es que atrae muchas hormigas.'),
       (2, 6, 2.0, '2018-02-14', 'Muy mal me llego rota y aparte a destiempo.'),
       (3, 6, 1.0, '2018-02-25', 'No parece una mariposa, parece más una araña. Además estaba quebrada una rama de vainilla. Debieron tener más cuidado con transportar sus productos'),
       (4, 6, 3.0, '2018-04-11', 'Lo puse en mi cocina y aromatizó dulce lo único que no dura mucho el aromatizante.'),

       (1, 5, 4.0, '2018-01-28', 'Esta algo caro pero vale la pena ya que a mi me ha durado muchísimo y eso que ocupo mucho la vainilla incluso le he dado a mi hija unas varillas.'),
       (2, 5, 1.0, '2018-02-01', 'Esta muy caro y casi no consumo vainilla aparte que está desbalanceado el  precio con la cantidad.'),
       (3, 5, 5.0, '2018-03-03', 'Muy barato, además tienen mucho sabor lo recomiendo a todos.'),
       (4, 5, 4.0, '2018-03-07', 'Los compré porque una amiga los necesitaba para hacernos un pastel por mi cumpleaños.'),

       (1, 4, 1.0, '2018-03-29', 'No me gusto para nada ya que en la foto se ve bonito pero ya en real se ve plastificado y súper rasposo no me gusto para nada. Cero recomendado'),
       (2, 4, 1.0, '2018-04-20', 'Está muy feo, no me gusto donde puedo pedir la devolución?'),
       (3, 4, 5.0, '2018-04-24', 'Me recordó al tapete que tenía de niña, que padre que por fin lo tengo de nuevo.'),

       (1, 3, 5.0, '2018-04-20', 'La verdad si lo recomiendo ya que compre 12 mantelelitos y mira que toda la familia me decían que muy padres y todo.'),
       (3, 3, 3.0, '2018-04-20', 'Esperaba que fuera un tapete más grande pero era un mantel individual aun así esta muy bien hecho'),
       (4, 3, 4.0, '2018-04-23', 'Muy buen producto y muy bien hecho felicidades a la artesana.'),

       (2, 2, 5.0, '2018-02-25', 'Toda la familia me estuvo diciendo que donde lo compre si ni había ido a Oaxaca y mira que ya les promocione su página jaja muy bonitos productos y de gran calidad.'),
       (3, 2, 3.0, '2018-04-14', 'Pensé que era un jarrón pero es más chiquito, lo puse como adorno en mi comedor.'),
       (4, 2, 3.0, '2018-04-26', 'El adorno llegó cuarteado les doy 3 estrellas pero por favor quiero que me envíen de nuevo el adorno'),

       (2, 1, 5.0, '2018-04-17', 'Muy padre ya huele rico a naranja y aparte cuando se acaba puedes reutilizar el vasito para más velas.'),
       (4, 1, 5.0, '2018-04-18', 'Dura mucho aunque sea muy pequeña la vela además la base en barro negro se ve muy bonito');

       (0, 0, 0.0, '2018-00-00', ''),
       (0, 0, 0.0, '2018-00-00', ''),

       SELECT *
FROM `comment`
ORDER BY datePub DESC
