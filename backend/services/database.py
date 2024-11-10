import sqlite3
import random
import os
import csv
from dotenv import load_dotenv

load_dotenv()
db_name = os.getenv("DB")

#---
# Connection
def open_connection(db: str):
    return sqlite3.connect(db)

def close_connection(con: sqlite3.Connection):
    con.close()
#---
# Bookmark

def insert_bookmark(uid: str, loc: str, coords: str):
    try:
    # Open database connection

        con = open_connection(db_name)
        cur = con.cursor()
        cur.execute("INSERT INTO bookmark (user_id, location, lat, long) VALUES ((SELECT id FROM user WHERE user_id = ?), ?, ?, ?);", (uid, loc, coords[0], coords[1]))
        con.commit()

    except sqlite3.IntegrityError as e:
        # Handle cases like foreign key constraint failure or unique constraint violation
        print("IntegrityError:", e)
        return False
    except sqlite3.OperationalError as e:
        # Handle operational errors, e.g., issues with the database connection or SQL syntax errors
        print("OperationalError:", e)
    except Exception as e:
            # General exception handler for unexpected errors
            print("An error occurred:", e)

    finally:
        # Ensure resources are properly closed
        if cur:
            cur.close()
        if con:
            close_connection(con)

def delete_bookmark(uid: str, loc: str):
    con = open_connection(db_name)
    cur = con.cursor()
    cur.execute("DELETE FROM bookmark WHERE user_id = (SELECT id FROM user WHERE user_id = ?) AND location = ?;", (uid,loc))
    con.commit()
    cur.close()
    close_connection(con)

def retrieve_bookmarks(uid: str):
    con = open_connection(db_name)
    cur = con.cursor()
    res = cur.execute("SELECT location, lat, long from bookmark where user_id = (SELECT id FROM user WHERE user_id = ?);", (uid,)).fetchall()
    cur.close()
    close_connection(con)
    return res

#---
# user

def create_user():
    con = open_connection(db_name)
    cur = con.cursor()
    while True:
        number = random.randint(10**9, 10**10 - 1)
        user_count = cur.execute("SELECT COUNT(*) FROM user WHERE user_id = ?", (number,)).fetchone()
        if (user_count[0] == 0) :
            cur.execute("INSERT INTO user (user_id) VALUES (?)", (number,))
            con.commit()
            break
    cur.close()
    close_connection(con)
    print(number)
    return number

def check_user(uid):
    con = open_connection(db_name)
    cur = con.cursor()
    res = cur.execute("SELECT * FROM user WHERE user_id = ?", (uid,)).fetchone()
    cur.close()
    close_connection(con)
    if not res:
        return False
    return True

#---
# Carpark

def populate_carparks(data):
    try:
        con = open_connection(db_name)
        cur = con.cursor()
        cur.executemany('''
                        INSERT OR IGNORE INTO carpark (agency, carpark_id, address, lat, long, price, price_weekend, EV)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        ''', data)
        con.commit()
        print("Populated carpark table")
    except sqlite3.Error as e:
        print(f"An error occurred while updating carparks: {e}")
    finally:
        if cur:
            cur.close()
        if con:
            close_connection(con)

def retrieve_carparks():
    try:
        con = open_connection(db_name)
        cur = con.cursor()
        res = cur.execute("SELECT * FROM carpark").fetchall()
        carpark_dict = {
            row[1]: {
                "agency": row[0],
                "carpark_id": row[1],
                "address": row[2],
                "lat": row[3],
                "long": row[4],
                "price": row[5],
                "price_weekend": row[6],
                "EV": row[7]
            }
            for row in res
        }

        return carpark_dict
    except sqlite3.Error as e:
        print(f"An error occurred while retrieving carparks: {e}")
        return []
    finally:
        if cur:
            cur.close()
        if con:
            close_connection(con)


#---
# Create/test db
def create_db():
    con = open_connection(db_name)
    cur = con.cursor() # We use database id here so as to optimize efficiency for internal queries
    cur.execute("""
                CREATE TABLE IF NOT EXISTS bookmark (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(10) NOT NULL,
                location VARCHAR(255) NOT NULL,
                lat VARCHAR(100) NOT NULL,
                long VARCHAR(100) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES user(id),
                UNIQUE (user_id, location)
                );
                """)
    cur.execute("""
                CREATE TABLE IF NOT EXISTS user (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(10) NOT NULL UNIQUE
                );
                """)
    cur.execute("""
                CREATE TABLE IF NOT EXISTS carpark (
                agency VARCHAR(10) NOT NULL,
                carpark_id VARCHAR(20) NOT NULL PRIMARY KEY,
                ADDRESS VARCHAR(100) NOT NULL,
                lat VARCHAR(100) NOT NULL,
                long VARCHAR(100) NOT NULL,
                price VARCHAR(100) NOT NULL,
                price_weekend VARCHAR(100) NOT NULL,
                EV VARCHAR(10) NOT NULL
                );
                """)

    # cur.execute("INSERT INTO user (user_id) VALUES ('123456789');")
    # cur.execute("INSERT INTO bookmark (user_id, location) VALUES ('1','testing')")
    # con.commit()
    cur.close()
    close_connection(con)

def test_db():
    con = open_connection(db_name)
    cur = con.cursor()
    required_tables = {"bookmark": False, "user": False, "carpark": False}
    res = cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    for table_name, in res:
        if table_name in required_tables:
            required_tables[table_name] = True
    cur.close()
    close_connection(con)
    return all(required_tables.values())

def main():
    create_db()
    res = test_db()
    if res:
        print("DB create OK")

    desired_headers = ['agency', 'carpark_id', 'address', 'lat', 'long', 'price', 'price_weekend', 'EV']

    csv_file_path = './assets/CarparkInformation_final.csv'
    data = []
    with open(csv_file_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            selected_row = {key: row[key] for key in desired_headers if key in row}
            data.append(tuple(selected_row.values()))

    populate_carparks(data)




#---
if __name__ == "__main__":
    main()
