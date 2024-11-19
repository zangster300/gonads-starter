package convex

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"time"
)

type LinkDocument struct {
	Id       string  `json:"normalizedId"`
	Short    string  `json:"short"`
	Long     string  `json:"long"`
	Created  float64 `json:"created"`
	LastEdit float64 `json:"lastEdit"`
	Owner    string  `json:"owner"`
}

type TaskDocument struct {
	ID          string  `json:"_id"`
	CreationTime float64 `json:"creationTime"`
	IsCompleted  bool    `json:"isCompleted"`
	Text         string  `json:"text"`
}

type StatsMap = map[string]interface{}

type ConvexDB struct {
	url   string
}

type UdfExecution struct {
	Path   string                 `json:"path"`
	Args   map[string]interface{} `json:"args"`
	Format string                 `json:"format"`
}

type ConvexResponse struct {
	Status       string          `json:"status"`
	Value        json.RawMessage `json:"value"`
	ErrorMessage string          `json:"errorMessage"`
}

func NewConvexDB(url string) *ConvexDB {
	return &ConvexDB{url: url}
}

func (c *ConvexDB) mutation(args *UdfExecution) error {
	url := fmt.Sprintf("%s/api/mutation", c.url)
	encodedArgs, err := json.Marshal(args)
	if err != nil {
		return err
	}
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(encodedArgs))
	if err != nil {
		return err
	}
	if resp.StatusCode != 200 {
		return fmt.Errorf("unexpected status code from Convex: %d", resp.StatusCode)
	}

	defer resp.Body.Close()
	var convexResponse ConvexResponse
	err = json.NewDecoder(resp.Body).Decode(&convexResponse)
	if err != nil {
		return err
	}
	if convexResponse.Status == "success" {
		return nil
	}
	if convexResponse.Status == "error" {
		return fmt.Errorf("error from Convex: %s", convexResponse.ErrorMessage)
	}
	return fmt.Errorf("unexpected response from Convex: %s", resp.Body)
}

func (c *ConvexDB) query(args *UdfExecution) (json.RawMessage, error) {
	url := fmt.Sprintf("%s/api/query", c.url)
	encodedArgs, err := json.Marshal(args)
	if err != nil {
		return nil, err
	}
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(encodedArgs))
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status code from Convex: %d: %s", resp.StatusCode, body)
	}

	defer resp.Body.Close()
	var convexResponse ConvexResponse
	err = json.NewDecoder(resp.Body).Decode(&convexResponse)
	if err != nil {
		return nil, err
	}
	if convexResponse.Status == "success" {
		return convexResponse.Value, nil
	}
	if convexResponse.Status == "error" {
		return nil, fmt.Errorf("error from Convex: %s", convexResponse.ErrorMessage)
	}
	return nil, fmt.Errorf("unexpected response from Convex: %s", resp.Body)
}

func (db *ConvexDB) CreateUser(user *User) error {
	args := UdfExecution{"users:createUser", map[string]interface{}{"user": user}, "json"}
	return db.mutation(&args)
}

func (db *ConvexDB) LoadAllTasks() ([]*Task, error) {
	// Implement logic to load all tasks from the database
	args := UdfExecution{"tasks:get", map[string]interface{}{}, "json"}
	resp, err := db.query(&args)
	if err != nil {
		return nil, err
	}
	var docs []*TaskDocument
	decoder := json.NewDecoder(bytes.NewReader(resp))
	decoder.UseNumber()
	err = decoder.Decode(&docs)
	if err != nil {
		return nil, err
	}
	if docs == nil {
		err := fs.ErrNotExist
		return nil, err
	}

	var tasks []*Task
	for _, doc := range docs {
		task := Task{
			ID:          doc.ID,
			CreationTime: time.Unix(int64(doc.CreationTime), 0),
			IsCompleted:  doc.IsCompleted,
			Text:         doc.Text,
		}
		tasks = append(tasks, &task)
	}
	return tasks, nil
}

func (db *ConvexDB) LoadTask(id string) (*Task, error) {
	args := UdfExecution{"load:task", map[string]interface{}{"normalizedId": id}, "json"}
	resp, err := db.query(&args)
	if err != nil {
		return nil, err
	}
	var doc *TaskDocument
	decoder := json.NewDecoder(bytes.NewReader(resp))
	decoder.UseNumber()
	err = decoder.Decode(&doc)
	if err != nil {
		return nil, err
	}
	if doc == nil {
		err := fs.ErrNotExist
		return nil, err
	}
	task := Task{
		ID:          doc.ID,
		CreationTime: time.Unix(int64(doc.CreationTime), 0),
		IsCompleted:  doc.IsCompleted,
		Text:         doc.Text,
	}
	return &task, nil
}

func (db *ConvexDB) ToggleTask(id string) error {
	args := UdfExecution{"tasks:toggle", map[string]interface{}{"id": id}, "json"}
	return db.mutation(&args)
}

func (db *ConvexDB) SaveTask(task *Task) error {
	document := TaskDocument{
		ID:          task.ID,
		CreationTime: float64(task.CreationTime.Unix()),
		IsCompleted:  task.IsCompleted,
		Text:         task.Text,
	}
	args := UdfExecution{"store:saveTask", map[string]interface{}{"task": document}, "json"}
	return db.mutation(&args)
}


func (c *ConvexDB) LoadAll() ([]*Link, error) {
	args := UdfExecution{"load:loadAll", map[string]interface{}{}, "json"}
	resp, err := c.query(&args)
	if err != nil {
		return nil, err
	}
	var docs []LinkDocument
	decoder := json.NewDecoder(bytes.NewReader(resp))
	decoder.UseNumber()
	err = decoder.Decode(&docs)
	if err != nil {
		return nil, err
	}
	var links []*Link
	for _, doc := range docs {
		link := Link{
			Short:    doc.Short,
			Long:     doc.Long,
			Created:  time.Unix(int64(doc.Created), 0),
			LastEdit: time.Unix(int64(doc.LastEdit), 0),
			Owner:    doc.Owner,
		}
		links = append(links, &link)
	}
	return links, nil
}

func (c *ConvexDB) Load(short string) (*Link, error) {
	args := UdfExecution{"load:loadOne", map[string]interface{}{"normalizedId": linkID(short)}, "json"}
	resp, err := c.query(&args)
	if err != nil {
		return nil, err
	}
	var doc *LinkDocument
	decoder := json.NewDecoder(bytes.NewReader(resp))
	decoder.UseNumber()
	err = decoder.Decode(&doc)
	if err != nil {
		return nil, err
	}
	if doc == nil {
		err := fs.ErrNotExist
		return nil, err
	}

	link := Link{
		Short:    doc.Short,
		Long:     doc.Long,
		Created:  time.Unix(int64(doc.Created), 0),
		LastEdit: time.Unix(int64(doc.LastEdit), 0),
		Owner:    doc.Owner,
	}
	return &link, nil
}

func (c *ConvexDB) Save(link *Link) error {
	document := LinkDocument{
		Id:       linkID(link.Short),
		Short:    link.Short,
		Long:     link.Long,
		Created:  float64(link.Created.Unix()),
		LastEdit: float64(link.LastEdit.Unix()),
		Owner:    link.Owner,
	}
	args := UdfExecution{"store", map[string]interface{}{"link": document}, "json"}
	return c.mutation(&args)
}

func (c *ConvexDB) LoadStats() (ClickStats, error) {
	args := UdfExecution{"stats:loadStats", map[string]interface{}{}, "json"}
	response, err := c.query(&args)
	if err != nil {
		return nil, err
	}
	var stats StatsMap
	decoder := json.NewDecoder(bytes.NewReader(response))
	decoder.UseNumber()
	err = decoder.Decode(&stats)
	if err != nil {
		return nil, err
	}
	clicks := make(ClickStats)
	for k, v := range stats {
		num, err := v.(json.Number).Float64()
		if err != nil {
			return nil, err
		}
		clicks[k] = int(num)
	}
	return clicks, nil
}

func (c *ConvexDB) SaveStats(stats ClickStats) error {
	mungedStats := make(map[string]int)
	for id, clicks := range stats {
		mungedStats[linkID(id)] = clicks
	}
	args := UdfExecution{"stats:saveStats", map[string]interface{}{"stats": mungedStats}, "json"}
	return c.mutation(&args)
}