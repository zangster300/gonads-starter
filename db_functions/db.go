package convex

import (
	_ "embed"
	"net/url"
	"strings"
	"time"
)

// Link is the structure stored for each go short link.
type Link struct {
	Short    string // the "foo" part of http://go/foo
	Long     string // the target URL or text/template pattern to run
	Created  time.Time
	LastEdit time.Time // when the link was last edited
	Owner    string    // user@domain
}

// ClickStats is the number of clicks a set of links have received in a given
// time period. It is keyed by link short name, with values of total clicks.
type ClickStats map[string]int

// Task represents a task with a completion status and text description.
type Task struct {
	ID          string    // unique identifier for the task
	CreationTime time.Time // when the task was created
	IsCompleted  bool      // whether the task is completed
	Text         string    // description of the task
}

type User struct {
	ID          string    // unique identifier for the user
	Email       string    // email address of the user
	Password    string    // password of the user
	Created     time.Time // when the user was created
	LastLogin   time.Time // when the user was last logged in
}

// linkID returns the normalized ID for a link short name.
func linkID(short string) string {
	id := url.PathEscape(strings.ToLower(short))
	id = strings.ReplaceAll(id, "-", "")
	return id
}

type Database interface {
	// LoadAll() ([]*Link, error)
	// Load(short string) (*Link, error)
	// Save(link *Link) error
	// LoadStats() (ClickStats, error)
	// SaveStats(stats ClickStats) error
	CreateUser(user *User) error
	LoadAllTasks() ([]*Task, error)
	LoadTask(id string) (*Task, error)
	SaveTask(task *Task) error
}