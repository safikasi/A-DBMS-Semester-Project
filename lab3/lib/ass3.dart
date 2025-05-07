import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Profile Card',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: Scaffold(
        appBar: AppBar(title: Text('Profile Card')),
        body: Center(
          child: ProfileCard(
            name: 'Safwan Khan Kasi',
            bio:
                'Full-stack developer, open-source contributor, and Flutter enthusiast.',
            imageUrl: 'https://picsum.photos/id/100/200/200',
          ),
        ),
      ),
    );
  }
}

class ProfileCard extends StatelessWidget {
  final String name;
  final String bio;
  final String imageUrl;

  const ProfileCard({
    Key? key,
    required this.name,
    required this.bio,
    required this.imageUrl,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(24),
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.4),
            spreadRadius: 2,
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Profile Picture with Border
          Row(
            children: [
              // Outer CircleAvatar for border [[9]]
              CircleAvatar(
                radius: 48, // Outer radius (border + image)
                backgroundColor: Colors.indigo, // Border color
                child: CircleAvatar(
                  radius: 44, // Inner radius (image only)
                  backgroundImage: NetworkImage(
                    imageUrl,
                  ), // Profile image [[6]]
                ),
              ),
              SizedBox(width: 20),
              Expanded(
                child: Text(
                  name,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          // Bio/Description
          Text(
            bio,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 15, color: Colors.grey[800]),
          ),
        ],
      ),
    );
  }
}
