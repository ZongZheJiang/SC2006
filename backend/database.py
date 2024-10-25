import sqlite3
import random

db_name = "carnav.db"

#---
# Connection
def open_connection(db: str):
    return sqlite3.connect(db)

def close_connection(con: sqlite3.Connection):
    con.close()
#---
# Bookmark

def insert_bookmark(uid: str, loc: str):
    con = open_connection(db_name)
    cur = con.cursor()
    cur.execute("INSERT INTO bookmarks (user_id, location) VALUES ((SELECT id FROM users WHERE user_id = ?), ?);", (uid, loc))
    con.commit()
    cur.close()
    close_connection(con)

def delete_bookmark(uid: str, loc: str):
    con = open_connection(db_name)
    cur = con.cursor()
    cur.execute("DELETE FROM bookmarks WHERE user_id = (SELECT id FROM users WHERE user_id = ?) AND location = ?;", (uid,loc))
    con.commit()
    cur.close()
    close_connection(con)

def retrieve_bookmarks(uid: str):
    con = open_connection(db_name)
    cur = con.cursor()
    res = cur.execute("SELECT location from bookmarks where user_id = (SELECT id FROM users WHERE user_id = ?);", (uid,)).fetchall()
    cur.close()
    close_connection(con)
    return [item for sublist in res for item in sublist]
    
#---
# User

def create_user():
    con = open_connection(db_name)
    cur = con.cursor()
    while True:
        number = random.randint(10**9, 10**10 - 1)
        user_count = cur.execute("SELECT COUNT(*) FROM USERS WHERE user_id = ?", (number,)).fetchone()
        if (user_count[0] == 0) :
            cur.execute("INSERT INTO USERS (user_id) VALUES (?)", (number,))
            con.commit()
            break
    cur.close()
    close_connection(con)
    return number


#---
# Create/test db
def create_db(con: sqlite3.Connection):
    cur = con.cursor() # We use database id here so as to optimize efficiency for internal queries
    cur.execute("""
                CREATE TABLE IF NOT EXISTS bookmarks (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(10) NOT NULL,
                location VARCHAR(255) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
                );
                """)
    cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(10) NOT NULL UNIQUE
                );
                """)
    # cur.execute("INSERT INTO users (user_id) VALUES ('123456789');")
    # cur.execute("INSERT INTO bookmarks (user_id, location) VALUES ('1','testing')")
    # con.commit()
    cur.close()

def test_db(con: sqlite3.Connection):
    cur = con.cursor()
    res = cur.execute("SELECT name FROM sqlite_master").fetchall()
    if res[0][0] == "bookmarks" and (res[1][0] == "users" or res[2][0] == "users"):
        return True
    
    return False

def main():
    con = open_connection(db_name)
    create_db(con)
    res = test_db(con)
    if res:
        print("DB create OK")
    
    close_connection(con)
#---
if __name__ == "__main__":
    main()