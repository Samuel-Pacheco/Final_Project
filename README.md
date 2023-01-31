# Final_Project
## Meteorite
### Topic 
NASA provides data on the impact of meteorites on earth's surface. A meteorite is specifically a meteor that makes it through the atmosphere of a planet or moon. In this case, our data looks at meteorites that break the earth's atmosphere. Our team selected this topic because we have all had a fascination with space from early childhood. Additionally, we are trying to get in NASA's good graces for future job opportunities. ;)
Our team has communicated regularly via slack and a group chat. We also consistently met on Saturdays. Our team dynamic consists of working on the majority of the work together, while ensuring our respective roles are completed for that week. I am happy to say our team is blessed to have a very dependable and highly communicative bunch.

### Data Source 

The meteorite data is sourced from data.nasa.gov and can be found at the following link: 

https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh

The data includes the names, ID's, name types, mass, and coordinates of the meteorites that have hit earth. Using this data, we created an interactive dashboard that displays the locations of meteorite landings on earth. After properly sorting through our data and creating an interactive map, Machine Learning was used train and create a model that can identify different classifications of meteorites. Through our analysis we were able to answer the following question: What classes of meteorite cause explosions on impact versus just landing?

### Tools 

Python was used to clean and analyze the data, PgAdmin created the databases, and unsupervised machine learning was used to create a model. The dashboard was created using HTML, Javascript, JSON, and CSS.

## Google Slides
https://docs.google.com/presentation/d/1HI_pxGFnGTWxMkYYfCUIom2jEIbnfm3WXMqSdlZBKHc/edit#slide=id.g1d20817582b_0_23

## ERD Graph
![Final_ERD](https://user-images.githubusercontent.com/111028230/211974218-84185b2d-2c64-4a99-a15f-3ec992160871.PNG)

## HTML Dashboard
The Dashboard is an interactive HTML Webpage. The user is able to look at the location of meteorite landing locations based on time frame. 

![image](https://user-images.githubusercontent.com/111031608/214206757-dfe55e49-f87f-4e98-9e16-69564eff5ae5.png)

![image](https://user-images.githubusercontent.com/111031608/214206804-fdcb6aac-c5e7-49f3-966a-6aac40d909eb.png)

[Final Project Interactive Web Page](https://samuel-pacheco.github.io/Fallen_Sky.github.io/)

## Tableau Graphs
![image](https://user-images.githubusercontent.com/53358476/214455089-7d76af25-80cf-4933-aef6-2b79e4c35f90.png)

[Impact and Mass Charts](https://public.tableau.com/shared/4H2PGM5WN?:display_count=n&:origin=viz_share_link)

### Summary 

The most interesting way to interact with NASA's meteorite data is to see it visually displayed. Correlating the meteorite landings with the location visually on a map was the main part of this project. To take the data a step further, we trained a Kmeans Machine Learning model to identify different classes of data. We also Used statistical analysis to identify meteorite with explosive characteristics: L6 and H5 classification types both create explosions on impact. 

In a future analysis we would acquire more data and use our machine learning model to predict the next meteorite location, mass, crater diameter, and material. We would also make our visuals more interactive. For example, we would have the dots that indicate meteorite landing locations be different sizes based on how large the meteorite was. In conclusion, this project was good experience to test our python, database, dashboard and modeling skills. The project has a lot of potential for future development. 
