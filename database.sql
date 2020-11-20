create table town(
	id serial not null primary key,
	town_names text not null,
    starting_string text not null
);

create table registration_numbers (
	id serial not null primary key,
	registrations text not null,
	town_id int,
	foreign key (town_id) references town(id)
);

insert into town (town_names, starting_string) values('Cape town', 'CA');
insert into town (town_names, starting_string) values('Bellville', 'CY');
insert into town (town_names, starting_string) values('Paarl', 'CJ');20.1